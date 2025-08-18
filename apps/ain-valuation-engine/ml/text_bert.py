
"""
BERT-based Regressor for Unstructured Text
Supports training and inference. Can output valuation prediction or learned text embedding.
"""
import torch
import torch.nn as nn
from transformers import BertModel, BertTokenizer
from typing import Optional, Tuple, Union

class TextBERTRegressor(nn.Module):
    def __init__(self, bert_model_name: str = 'bert-base-uncased', embedding_dim: int = 128, regression: bool = True):
        super().__init__()
        self.bert = BertModel.from_pretrained(bert_model_name)
        self.tokenizer = BertTokenizer.from_pretrained(bert_model_name)
        self.embedding_dim = embedding_dim
        self.regression = regression
        self.embedding_layer = nn.Linear(self.bert.config.hidden_size, embedding_dim)
        if regression:
            self.reg_head = nn.Linear(embedding_dim, 1)

    def forward(self, input_ids, attention_mask, return_embedding: bool = False):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled = outputs.pooler_output
        embedding = torch.relu(self.embedding_layer(pooled))
        if self.regression:
            pred = self.reg_head(embedding)
            if return_embedding:
                return pred, embedding
            return pred
        return embedding

    def preprocess_text(self, text: str, max_length: int = 128):
        encoding = self.tokenizer(text, truncation=True, padding='max_length', max_length=max_length, return_tensors='pt')
        return encoding['input_ids'], encoding['attention_mask']

# Example usage
if __name__ == "__main__":
    model = TextBERTRegressor()
    text = "Vehicle in excellent condition, low mileage, no accidents."
    input_ids, attention_mask = model.preprocess_text(text)
    with torch.no_grad():
        pred = model(input_ids, attention_mask)
    print("Valuation prediction:", pred.item())
