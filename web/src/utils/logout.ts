import Cookies from 'js-cookie';

export const logout = () => {
  Object.keys(Cookies.get()).forEach((cookieName) => {
    Cookies.remove(cookieName);
  });
};
