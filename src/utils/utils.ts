export const resGeneric = ({ status_code, message, data }: ResGeneric) => {
  return {
    status_code,
    data,
    message,
  };
};
