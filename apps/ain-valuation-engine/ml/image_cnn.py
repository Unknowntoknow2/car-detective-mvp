import torch.nn as nn

import torch
import torch.nn as nn
import torch.nn.functional as F
import joblib

class ImageCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32*56*56, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )

    def forward(self, x):
        x = self.conv(x)
        return self.fc(x)

    def predict(self, X_img):
        # X_img: numpy array, shape (N, 3, 224, 224)
        with torch.no_grad():
            x = torch.tensor(X_img, dtype=torch.float32)
            out = self.forward(x)
            return out.squeeze(-1).cpu().numpy()

    def save(self, path):
        torch.save(self.state_dict(), path)

    def load(self, path):
        self.load_state_dict(torch.load(path))
