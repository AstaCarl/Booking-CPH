export const getUser = () => {
  if (!localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]) {
    return {
      isLoggedIn: false,
    };
  }

  const user = JSON.parse(
    localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]
  )?.user;

  return {
    isLoggedIn: true,
    userId: user.id,
    firstName: user.user_metadata.first_name ?? "",
    lastName: user.user_metadata.last_name ?? "",
    email: user.email,
  };
};
