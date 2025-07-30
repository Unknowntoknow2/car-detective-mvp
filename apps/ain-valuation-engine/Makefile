.PHONY: setup clean build run test lint coverage

setup:
	pip install -r requirements.txt

clean:
	rm -rf __pycache__ data/processed models/checkpoints .coverage .pytest_cache

build:
	docker build -t ain-valuation-engine .

run:
	docker run --rm -p 8000:8000 ain-valuation-engine

test:
	pytest --maxfail=1 --disable-warnings

lint:
	flake8 . --exclude=venv,__pycache__

coverage:
	pytest --cov=. --cov-report=html
