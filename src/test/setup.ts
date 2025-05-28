
// Mock globals that Node doesn't have
global.TextEncoder = TextEncoder;
// Use a more compatible implementation for TextDecoder
class CustomTextDecoder {
  constructor() {}
  decode() {
    return '';
  }
}
global.TextDecoder = CustomTextDecoder as any;
