
"""
Advanced stacking ensemble training for valuation engine.
Loads preprocessed tabular, image, and text datasets.
Trains XGBoost, DNN, CNN, and BERT base models with OOF predictions.
Builds meta-feature matrix, trains meta-learner, evaluates, and saves all artifacts.
"""
import os
import numpy as np
import pandas as pd
import torch
from sklearn.model_selection import KFold
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import Ridge
import joblib

from ml.image_cnn import ImageCNNRegressor
from ml.text_bert import TextBERTRegressor

try:
    import xgboost as xgb
except ImportError:
    xgb = None

N_SPLITS = 5
SEED = 42
DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'

# ---- DATA LOADING ----
def load_preprocessed_tabular():
    X = np.load('data/X_tabular.npy')
    y = np.load('data/y_tabular.npy')
    return X, y

def load_preprocessed_images():
    X = np.load('data/X_images.npy')  # shape: (N, C, H, W)
    y = np.load('data/y_images.npy')
    return torch.tensor(X, dtype=torch.float32), y

def load_preprocessed_text():
    input_ids = np.load('data/text_input_ids.npy')
    attn_masks = np.load('data/text_attn_masks.npy')
    y = np.load('data/y_text.npy')
    return torch.tensor(input_ids), torch.tensor(attn_masks), y

# ---- BASE MODELS ----
def build_dnn(input_dim):
    import torch.nn as nn
    class DNN(nn.Module):
        def __init__(self, in_dim):
            super().__init__()
            self.net = nn.Sequential(
                nn.Linear(in_dim, 128), nn.ReLU(),
                nn.Linear(128, 64), nn.ReLU(),
                nn.Linear(64, 1)
            )
        def forward(self, x):
            return self.net(x)
    return DNN(input_dim)

# ---- OOF TRAINING UTILS ----
def oof_train_xgb(X, y, n_splits):
    oof_preds = np.zeros_like(y)
    models = []
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=SEED)
    for train_idx, val_idx in kf.split(X):
        model = xgb.XGBRegressor(n_estimators=100, random_state=SEED)
        model.fit(X[train_idx], y[train_idx])
        oof_preds[val_idx] = model.predict(X[val_idx])
        models.append(model)
    return oof_preds, models

def oof_train_dnn(X, y, n_splits):
    oof_preds = np.zeros_like(y)
    models = []
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=SEED)
    X = torch.tensor(X, dtype=torch.float32)
    y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)
    for train_idx, val_idx in kf.split(X):
        model = build_dnn(X.shape[1]).to(DEVICE)
        optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
        loss_fn = torch.nn.MSELoss()
        X_train, y_train = X[train_idx].to(DEVICE), y[train_idx].to(DEVICE)
        X_val = X[val_idx].to(DEVICE)
        for epoch in range(5):
            model.train()
            optimizer.zero_grad()
            preds = model(X_train)
            loss = loss_fn(preds, y_train)
            loss.backward()
            optimizer.step()
        model.eval()
        with torch.no_grad():
            oof_preds[val_idx] = model(X_val).cpu().squeeze().numpy()
        models.append(model.cpu())
    return oof_preds, models

def oof_train_image(X, y, n_splits):
    oof_preds = np.zeros_like(y)
    models = []
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=SEED)
    y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)
    for train_idx, val_idx in kf.split(X):
        model = ImageCNNRegressor().to(DEVICE)
        optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
        loss_fn = torch.nn.MSELoss()
        X_train, y_train = X[train_idx].to(DEVICE), y[train_idx].to(DEVICE)
        X_val = X[val_idx].to(DEVICE)
        for epoch in range(3):
            model.train()
            optimizer.zero_grad()
            preds = model(X_train)
            loss = loss_fn(preds, y_train)
            loss.backward()
            optimizer.step()
        model.eval()
        with torch.no_grad():
            oof_preds[val_idx] = model(X_val).cpu().squeeze().numpy()
        models.append(model.cpu())
    return oof_preds, models

def oof_train_text(input_ids, attn_masks, y, n_splits):
    oof_preds = np.zeros_like(y)
    models = []
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=SEED)
    y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)
    for train_idx, val_idx in kf.split(input_ids):
        model = TextBERTRegressor().to(DEVICE)
        optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
        loss_fn = torch.nn.MSELoss()
        ids_train, mask_train = input_ids[train_idx].to(DEVICE), attn_masks[train_idx].to(DEVICE)
        y_train = y[train_idx].to(DEVICE)
        ids_val, mask_val = input_ids[val_idx].to(DEVICE), attn_masks[val_idx].to(DEVICE)
        for epoch in range(2):
            model.train()
            optimizer.zero_grad()
            preds = model(ids_train, mask_train)
            loss = loss_fn(preds, y_train)
            loss.backward()
            optimizer.step()
        model.eval()
        with torch.no_grad():
            oof_preds[val_idx] = model(ids_val, mask_val).cpu().squeeze().numpy()
        models.append(model.cpu())
    return oof_preds, models

# ---- MAIN TRAINING SCRIPT ----
def main():
    # Load preprocessed data
    X_tab, y_tab = load_preprocessed_tabular()
    X_img, y_img = load_preprocessed_images()
    input_ids, attn_masks, y_txt = load_preprocessed_text()

    # OOF training for each base model
    print('Training XGBoost...')
    tab_xgb_oof, tab_xgb_models = oof_train_xgb(X_tab, y_tab, N_SPLITS)
    print('Training DNN...')
    tab_dnn_oof, tab_dnn_models = oof_train_dnn(X_tab, y_tab, N_SPLITS)
    print('Training CNN...')
    img_cnn_oof, img_cnn_models = oof_train_image(X_img, y_img, N_SPLITS)
    print('Training BERT...')
    txt_bert_oof, txt_bert_models = oof_train_text(input_ids, attn_masks, y_txt, N_SPLITS)

    # Build meta-feature matrix
    meta_X = np.column_stack([tab_xgb_oof, tab_dnn_oof, img_cnn_oof, txt_bert_oof])
    meta_y = y_tab
    print('Training meta-learner...')
    meta_learner = Ridge().fit(meta_X, meta_y)

    # Evaluate on holdout (last fold as test)
    test_idx = np.arange(len(meta_y))[-len(meta_y)//N_SPLITS:]
    tab_test = X_tab[test_idx]
    img_test = X_img[test_idx]
    txt_test_ids = input_ids[test_idx]
    txt_test_mask = attn_masks[test_idx]
    y_test = meta_y[test_idx]
    tab_xgb_pred = np.mean([m.predict(tab_test) for m in tab_xgb_models], axis=0)
    tab_dnn_pred = np.mean([m(torch.tensor(tab_test, dtype=torch.float32)).detach().numpy().squeeze() for m in tab_dnn_models], axis=0)
    img_cnn_pred = np.mean([m(img_test).detach().numpy().squeeze() for m in img_cnn_models], axis=0)
    txt_bert_pred = np.mean([m(txt_test_ids, txt_test_mask).detach().numpy().squeeze() for m in txt_bert_models], axis=0)
    meta_pred = meta_learner.predict(np.column_stack([tab_xgb_pred, tab_dnn_pred, img_cnn_pred, txt_bert_pred]))

    # Metrics
    def report(name, y_true, y_pred):
        print(f"{name}: MAE={mean_absolute_error(y_true, y_pred):.2f} RMSE={mean_squared_error(y_true, y_pred, squared=False):.2f} R2={r2_score(y_true, y_pred):.3f}")
    report('XGBoost', y_test, tab_xgb_pred)
    report('DNN', y_test, tab_dnn_pred)
    report('CNN', y_test, img_cnn_pred)
    report('BERT', y_test, txt_bert_pred)
    report('Ensemble', y_test, meta_pred)

    # Save models and preprocessors
    os.makedirs('models', exist_ok=True)
    for i, m in enumerate(tab_xgb_models):
        joblib.dump(m, f'models/tabular_xgb_{i}.joblib')
    for i, m in enumerate(tab_dnn_models):
        torch.save(m.state_dict(), f'models/tabular_dnn_{i}.pt')
    for i, m in enumerate(img_cnn_models):
        torch.save(m.state_dict(), f'models/image_cnn_{i}.pt')
    for i, m in enumerate(txt_bert_models):
        torch.save(m.state_dict(), f'models/text_bert_{i}.pt')
    joblib.dump(meta_learner, 'models/meta_learner.joblib')

    print('All models and meta-learner saved.')

if __name__ == "__main__":
    main()
