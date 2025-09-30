// Test for deprecated VinService.decodeVin warning
import { VinService } from '../src/services/centralizedApi';

describe('VinService (deprecated)', () => {
  it('should log a deprecation warning when decodeVin is called', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const testVin = '1HGCM82633A004352';
    await VinService.decodeVin(testVin);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/deprecated/i));
    warnSpy.mockRestore();
  });
});
