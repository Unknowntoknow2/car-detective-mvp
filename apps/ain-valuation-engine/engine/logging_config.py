import logging
import sys

def setup_logging(log_level=logging.INFO, log_file=None):
    """
    Sets up structured logging for the inference API.
    Logs to stdout and optionally to a file. Uses a uniform format with timestamps and request context.
    """
    log_format = "[%(asctime)s] %(levelname)s %(name)s %(message)s"
    handlers = [logging.StreamHandler(sys.stdout)]
    if log_file:
        handlers.append(logging.FileHandler(log_file))

    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=handlers,
        force=True  # Overwrites previous configs (for uvicorn/fastapi)
    )
    # Set third-party noisy loggers to WARNING
    for noisy in ["uvicorn", "uvicorn.error", "uvicorn.access", "asyncio", "PIL"]:
        logging.getLogger(noisy).setLevel(logging.WARNING)
