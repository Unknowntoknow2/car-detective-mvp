# Multimodal Valuation Engine: Data Formats & Example Usage

## Data Format Requirements

### Tabular Data
- **Input:** Numpy array, Pandas DataFrame, or Torch Tensor of shape `(batch_size, num_features)`
- **Preprocessing:** Standard scaling/normalization as required by the tabular model

### Image Data
- **Input:** File path(s) to image(s) or PIL Image objects
- **Preprocessing:**
  - Resize to 224x224 (default)
  - Convert to RGB
  - Normalize using ImageNet mean/std
  - Use `ImageCNNRegressor.preprocess_image(image_path)` for single image

### Text Data
- **Input:** Raw string(s) (e.g., inspection notes, descriptions)
- **Preprocessing:**
  - Tokenize and pad/truncate to max length (default 128)
  - Use `TextBERTRegressor.preprocess_text(text)`

## Example Usage

### Training an Image CNN
```python
from ml.image_cnn import ImageCNNRegressor
import torch
model = ImageCNNRegressor()
img_tensor = ImageCNNRegressor.preprocess_image('example.jpg')
label = torch.tensor([[12345.0]])  # Example target value
loss = torch.nn.MSELoss()(model(img_tensor), label)
loss.backward()
```

### Training a BERT Regressor
```python
from ml.text_bert import TextBERTRegressor
import torch
model = TextBERTRegressor()
input_ids, attention_mask = model.preprocess_text('Excellent condition, low mileage.')
label = torch.tensor([[12345.0]])
loss = torch.nn.MSELoss()(model(input_ids, attention_mask), label)
loss.backward()
```

### Using the Ensemble
```python
from ml.ensemble import EnsembleValuator
# Assume xgb_model, dnn_model, cnn_model, bert_model are already trained
ensemble = EnsembleValuator(xgb_model, dnn_model, cnn_model, bert_model)
# X_tab: tabular features, X_img: image tensor, X_txt: (input_ids, attention_mask)
pred = ensemble.predict(X_tab, X_img, X_txt)
```

## Notes
- Each model can be trained independently.
- For inference, provide only the available modalities; the ensemble will use what is provided.
- For custom data pipelines, ensure preprocessing matches the above requirements.
