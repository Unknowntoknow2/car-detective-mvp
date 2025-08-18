
import torch
from typing import Dict, Optional, Any

class EnsembleValuator:
    """
    Multimodal ensemble for tabular, image, and text data.
    Each model can be trained independently and used in the ensemble.
    """
    def __init__(self, tabular_model=None, image_model=None, text_model=None, meta_learner=None):
        self.tabular_model = tabular_model
        self.image_model = image_model
        self.text_model = text_model
        self.meta_learner = meta_learner  # Optional meta-learner for stacking

    def predict(self, X_tab=None, X_img=None, X_txt=None, return_embeddings: bool = False):
        preds = []
        embeddings = []
        if self.tabular_model and X_tab is not None:
            tab_pred = self.tabular_model(X_tab)
            preds.append(tab_pred)
            if return_embeddings and hasattr(self.tabular_model, 'get_embedding'):
                embeddings.append(self.tabular_model.get_embedding(X_tab))
        if self.image_model and X_img is not None:
            if return_embeddings:
                img_pred, img_emb = self.image_model(X_img, return_embedding=True)
                preds.append(img_pred)
                embeddings.append(img_emb)
            else:
                preds.append(self.image_model(X_img))
        if self.text_model and X_txt is not None:
            if return_embeddings:
                txt_pred, txt_emb = self.text_model(*X_txt, return_embedding=True)
                preds.append(txt_pred)
                embeddings.append(txt_emb)
            else:
                preds.append(self.text_model(*X_txt))
        # Simple average ensemble (customize as needed)
        if preds:
            stacked = torch.stack([p.squeeze() for p in preds])
            ensemble_pred = torch.mean(stacked, dim=0)
        else:
            ensemble_pred = None
        if return_embeddings:
            return ensemble_pred, embeddings
        return ensemble_pred

    @staticmethod
    def preprocess_inputs(tabular=None, image_path=None, text=None, tab_preproc=None, img_size=224, text_model=None):
        X_tab = tab_preproc(tabular) if (tabular is not None and tab_preproc is not None) else tabular
        X_img = None
        if image_path is not None:
            from .image_cnn import ImageCNNRegressor
            X_img = ImageCNNRegressor.preprocess_image(image_path, size=img_size)
        X_txt = None
        if text is not None and text_model is not None:
            X_txt = text_model.preprocess_text(text)
        return X_tab, X_img, X_txt

# Example usage
if __name__ == "__main__":
    # from .image_cnn import ImageCNNRegressor
    # from .text_bert import TextBERTRegressor
    # tabular_model = ...
    # image_model = ImageCNNRegressor()
    # text_model = TextBERTRegressor()
    # ensemble = EnsembleValuator(tabular_model, image_model, text_model)
    # X_tab, X_img, X_txt = EnsembleValuator.preprocess_inputs(tabular, image_path, text, tab_preproc, 224, text_model)
    # pred = ensemble.predict(X_tab, X_img, X_txt)
    pass
