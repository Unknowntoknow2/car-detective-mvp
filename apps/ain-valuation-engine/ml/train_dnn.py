import torch
from torch.utils.data import DataLoader, TensorDataset
import pandas as pd
import joblib
from ml.dnn_model import ValuationDNN
from ml.feature_pipeline import build_feature_pipeline
from ml.eval_metrics import compute_metrics

# Load data
df = pd.read_csv("your_data.csv")
y = df["target"].values
X = df.drop(columns=["target"])
pipeline = build_feature_pipeline()
X_proc = pipeline.fit_transform(X)
input_dim = X_proc.shape[1]

model = ValuationDNN(input_dim)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = torch.nn.MSELoss()
ds = TensorDataset(torch.tensor(X_proc, dtype=torch.float32), torch.tensor(y, dtype=torch.float32).unsqueeze(1))
dl = DataLoader(ds, batch_size=32, shuffle=True)

for epoch in range(50):
    for xb, yb in dl:
        pred = model(xb)
        loss = loss_fn(pred, yb)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

torch.save(model.state_dict(), "dnn_model.pt")
joblib.dump(pipeline, "dnn_pipeline.joblib")

# Evaluate
model.eval()
with torch.no_grad():
    preds = model(torch.tensor(X_proc, dtype=torch.float32)).squeeze().numpy()
metrics = compute_metrics(y, preds)
print("MAE:", metrics["mae"], "RMSE:", metrics["rmse"])
