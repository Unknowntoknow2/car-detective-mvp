from transformers import BertModel, BertTokenizer

import torch
from transformers import BertModel, BertTokenizer
import joblib

class TextBERT:
    def __init__(self, model_name='bert-base-uncased'):
        self.model = BertModel.from_pretrained(model_name)
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.reg_head = torch.nn.Linear(self.model.config.hidden_size, 1)

    def predict(self, texts):
        # texts: list of strings
        inputs = self.tokenizer(texts, return_tensors='pt', padding=True, truncation=True, max_length=128)
        with torch.no_grad():
            outputs = self.model(**inputs)
            cls_emb = outputs.last_hidden_state[:, 0, :]
            preds = self.reg_head(cls_emb)
            return preds.squeeze(-1).cpu().numpy()

    def save(self, path):
        torch.save({
            'model': self.model.state_dict(),
            'reg_head': self.reg_head.state_dict()
        }, path)

    def load(self, path):
        state = torch.load(path)
        self.model.load_state_dict(state['model'])
        self.reg_head.load_state_dict(state['reg_head'])
