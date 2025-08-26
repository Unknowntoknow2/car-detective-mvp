import numpy as np
from sklearn.linear_model import Ridge
import joblib

class EnsembleValuator:
    def __init__(self, xgb_model, dnn_model, cnn_model=None, bert_model=None, meta_learner=None, blend_weights=None):
        self.xgb = xgb_model
        self.dnn = dnn_model
        self.cnn = cnn_model
        self.bert = bert_model
        self.meta = meta_learner or Ridge()
        self.blend_weights = blend_weights
        self.mode = 'stacking'  # or 'blending'

    def set_mode(self, mode):
        assert mode in ['stacking', 'blending']
        self.mode = mode

    def fit(self, X_tab, X_img=None, X_txt=None, y=None):
        xgb_preds = self.xgb.predict(X_tab)
        dnn_preds = self.dnn.predict(X_tab)
        features = [xgb_preds, dnn_preds]
        if self.cnn and X_img is not None:
            features.append(self.cnn.predict(X_img))
        if self.bert and X_txt is not None:
            features.append(self.bert.predict(X_txt))
        meta_X = np.column_stack(features)
        if self.mode == 'stacking':
            self.meta.fit(meta_X, y)
        elif self.mode == 'blending':
            if not self.blend_weights:
                n = len(features)
                self.blend_weights = [1/n]*n

    def predict(self, X_tab, X_img=None, X_txt=None):
        preds = [self.xgb.predict(X_tab), self.dnn.predict(X_tab)]
        if self.cnn and X_img is not None:
            preds.append(self.cnn.predict(X_img))
        if self.bert and X_txt is not None:
            preds.append(self.bert.predict(X_txt))
        meta_X = np.column_stack(preds)
        if self.mode == 'stacking':
            return self.meta.predict(meta_X)
        elif self.mode == 'blending':
            weights = np.array(self.blend_weights)
            return np.dot(meta_X, weights)

    def save(self, path):
        joblib.dump(self, path)

    @staticmethod
    def load(path):
        return joblib.load(path)

    def evaluate(self, X_tab, X_img, X_txt, y_true):
        y_pred = self.predict(X_tab, X_img, X_txt)
        mae = np.mean(np.abs(y_true - y_pred))
        rmse = np.sqrt(np.mean((y_true - y_pred)**2))
        r2 = 1 - np.sum((y_true - y_pred)**2) / np.sum((y_true - np.mean(y_true))**2)
        return {'mae': mae, 'rmse': rmse, 'r2': r2}
