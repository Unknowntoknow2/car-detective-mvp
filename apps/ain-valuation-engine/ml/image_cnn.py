
"""
CNN Regressor for Vehicle/Property Images
Supports training and inference. Can output valuation prediction or learned feature embedding.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from typing import Optional, Tuple, Union
from PIL import Image

class ImageCNNRegressor(nn.Module):
    def __init__(self, use_pretrained: bool = True, embedding_dim: int = 128, regression: bool = True):
        super().__init__()
        self.regression = regression
        self.embedding_dim = embedding_dim
        backbone = models.resnet18(pretrained=use_pretrained)
        num_features = backbone.fc.in_features
        modules = list(backbone.children())[:-1]  # Remove last FC
        self.feature_extractor = nn.Sequential(*modules)
        self.embedding_layer = nn.Linear(num_features, embedding_dim)
        if regression:
            self.reg_head = nn.Linear(embedding_dim, 1)

    def forward(self, x: torch.Tensor, return_embedding: bool = False) -> Union[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]]:
        features = self.feature_extractor(x)
        features = features.view(features.size(0), -1)
        embedding = F.relu(self.embedding_layer(features))
        if self.regression:
            pred = self.reg_head(embedding)
            if return_embedding:
                return pred, embedding
            return pred
        return embedding

    @staticmethod
    def get_preprocessing(size: int = 224):
        return transforms.Compose([
            transforms.Resize((size, size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    @staticmethod
    def preprocess_image(image_path: str, size: int = 224) -> torch.Tensor:
        img = Image.open(image_path).convert('RGB')
        transform = ImageCNNRegressor.get_preprocessing(size)
        return transform(img).unsqueeze(0)

# Example usage
if __name__ == "__main__":
    model = ImageCNNRegressor()
    img_tensor = ImageCNNRegressor.preprocess_image("example.jpg")
    with torch.no_grad():
        pred = model(img_tensor)
    print("Valuation prediction:", pred.item())
