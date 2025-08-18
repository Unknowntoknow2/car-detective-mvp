import subprocess
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(filename='monitoring.log', level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(message)s')

def run_golden_vin_suite():
    try:
        result = subprocess.run(['python', 'vin_golden_test_suite.py'], capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            logging.info('Golden VIN test suite ran successfully.')
            logging.info(result.stdout)
        else:
            logging.error('Golden VIN test suite failed.')
            logging.error(result.stderr)
    except Exception as e:
        logging.error(f'Exception running golden VIN test suite: {e}')

def run_recall_enrichment(vin):
    try:
        result = subprocess.run(['python', 'vin_decoder_abstraction.py', 'recalls', vin], capture_output=True, text=True, timeout=120)
        if result.returncode == 0:
            logging.info(f'Recall enrichment for VIN {vin} ran successfully.')
            logging.info(result.stdout)
        else:
            logging.error(f'Recall enrichment for VIN {vin} failed.')
            logging.error(result.stderr)
    except Exception as e:
        logging.error(f'Exception running recall enrichment for VIN {vin}: {e}')

def main():
    # Example: run once per day
    golden_vins = ['4T1R11AK4RU878557', '1HGCM82633A004352']
    run_golden_vin_suite()
    for vin in golden_vins:
        run_recall_enrichment(vin)
    logging.info('Monitoring run complete.')

    # Email alert integration: send alert if any ERROR in log
    try:
        with open('monitoring.log', 'r') as f:
            log_content = f.read()
        if 'ERROR' in log_content:
            from email_alert import send_email_alert
            error_lines = '\n'.join([line for line in log_content.split('\n') if 'ERROR' in line])
            send_email_alert('AIN Monitoring Alert', error_lines, 'destination@example.com')
            # Placeholder: Add Slack/webhook alert integration here if needed
    except Exception as e:
        logging.error(f'Failed to send alert email: {e}')

if __name__ == '__main__':
    main()
