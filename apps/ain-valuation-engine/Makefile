.PHONY: setup clean build run test lint coverage

setup:
	pip install -r requirements.txt

clean:
	rm -rf __pycache__ data/processed models/checkpoints .coverage .pytest_cache
	rm -f $(CANON) in_out/valuation_camry_market.json

build:
	docker build -t ain-valuation-engine .

run:
	docker run --rm -p 8000:8000 ain-valuation-engine

test:
	. .venv/bin/activate && pytest --maxfail=1 --disable-warnings

lint:
	. .venv/bin/activate && flake8 . --exclude=venv,__pycache__

coverage:
	. .venv/bin/activate && pytest --cov=. --cov-report=html

SHELL := /bin/bash
PY := .venv/bin/python

MARKET := camry
CANON := in_out/merged_$(MARKET)_comps.json
RAW_DIR := in_out/raw_comps
NORM_DIR := in_out/normalized

.PHONY: all comps normalize merge validate value anchor clean

all: comps value

normalize:
	mkdir -p $(NORM_DIR)
	# Example batch: normalize every file in $(RAW_DIR) to $(NORM_DIR)
	# If normalize_listing.py already accepts (in,out), uncomment this:
	# for f in $(RAW_DIR)/*; do \
	#   name=$$(basename $$f); \
	#   $(PY) normalize_listing.py $$f $(NORM_DIR)/$$name.json || echo "[WARN] $$f"; \
	# done
	@echo "Normalize step is optional here (use your own flow or harvest_paste.py)."

merge:
	mkdir -p in_out
	./scripts/merge_comps.py $(RAW_DIR) $(NORM_DIR) \
	  --out $(CANON) \
	  --expect-make TOYOTA \
	  --expect-model CAMRY \
	  --drop-outliers

validate:
	./scripts/validate_comps.py $(CANON)

comps: merge validate

value:
	export AIN_PIPELINE_PATH="$$PWD/artifacts/valuation_pipeline.joblib"; \
	export AIN_OUTDIR="$$PWD/in_out"; \
	$(PY) -m val_engine.main \
	  --vin 4T1G11AK5LU897892 \
	  --mileage 39000 \
	  --zip 95821 \
	  --condition excellent \
	  --title-status clean \
	  --owners 1 --accidents 0 \
	  --mode sell \
	  --comps-file $(CANON) \
	  --output in_out/valuation_camry_market.json; \
	jq '{comps:(.market.listings|length), anchor:.market.anchor, model:.model.pred, blended:.market.blended, estimated_value, confidence_score}' in_out/valuation_camry_market.json

anchor: comps value

.PHONY: checksum verify

checksum:
	. .venv/bin/activate && $(PY) scripts/write_artifact_checksum.py

verify:
	. .venv/bin/activate && $(PY) scripts/verify_artifact_checksum.py
