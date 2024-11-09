export default function useToken() {
  try {
    const tokenMatch = document.cookie.match('(^|;)\\s*token\\s*=\\s*([^;]+)');
    return tokenMatch ? tokenMatch.pop() : '';
  } catch (error) {
    return '';
  }
}
