export const getIndianTadkaAddress = () => {
  return {
    pincode: process.env.NEXT_PUBLIC_INDIAN_TADKA_PINCODE,
    buildingNumber: process.env.NEXT_PUBLIC_INDIAN_TADKA_BUILDINGNUMBER,
    street: process.env.NEXT_PUBLIC_INDIAN_TADKA_STREET,
    town: process.env.NEXT_PUBLIC_INDIAN_TADKA_TOWN,
  };
};
