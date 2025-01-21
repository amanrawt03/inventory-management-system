const api = "http://localhost:3000/api";

// auth
const loginApi = `${api}/auth/login`;
const logoutApi = `${api}/auth/logout`;
const loginWithGoogleApi = `${api}/auth/loginWithGoogle`;
const signupApi = `${api}/auth/signup`;
const requestApi = `${api}/auth/request`;
const resetApi = `${api}/auth/reset`;
const changePassApi = `${api}/auth/changePass`;
const updateProfileApi = `${api}/auth/update`;
const fetchProfileApi = `${api}/auth/getProfile`;
const UploadProfileImgApi = `${api}/auth/upload-profile-image`;

// location
const fetchLocationsApi = `${api}/inventory/paginate`;
const fetchLocationsList = `${api}/inventory`;
const createLocationApi = `${api}/inventory`;

// product
const fetchCostPriceApi = `${api}/product/costPrice`;
const fetchItemsApi = `${api}/product/paginate`;
const fetchProductsList = `${api}/product`;
const addNewProductApi = `${api}/product`;
const fetchStockInfoApi = `${api}/product/getStockInfo`;
const fetchProductInfoApi = `${api}/product/product-summary`;

// category
const createCategoryApi = `${api}/category`;
const fetchCategoriesList = `${api}/category`;
const fetchCategoriesApi = `${api}/category/paginate`;

// supplier
const fetchSuppliersApi = `${api}/supplier/paginate`;
const fetchSuppliersList = `${api}/supplier`;
const createSupplierApi = `${api}/supplier`;

// customer
const fetchCustomersList = `${api}/customer`;
const createCustomerApi = `${api}/customer`;

// transaction
const sellItemsApi = `${api}/transaction/sellItems`;
const purchaseItemsApi = `${api}/transaction/purchaseItems`;
const sellingTransactionApi = `${api}/transaction/sellingTransaction`;
const purchaseTransactionApi = `${api}/transaction/purchaseTransaction`;

// graph
const netProfitApi = `${api}/graph/netprofit`;

//notifications
const fetchNotificationsApi =  `${api}/notify`
const fetchUnreadNotificationsApi =  `${api}/notify/unread`
const markAsReadApi = `${api}/notify/mark-read`

export {
  loginApi,
  logoutApi,
  loginWithGoogleApi,
  signupApi,
  requestApi,
  resetApi,
  changePassApi,
  fetchProfileApi,
  updateProfileApi,
  UploadProfileImgApi,
  fetchCategoriesApi,
  fetchItemsApi,
  fetchStockInfoApi,
  fetchSuppliersApi,
  fetchLocationsApi,
  createCategoryApi,
  createSupplierApi,
  createLocationApi,
  purchaseItemsApi,
  createCustomerApi,
  sellItemsApi,
  fetchCostPriceApi,
  fetchCustomersList,
  fetchSuppliersList,
  fetchLocationsList,
  fetchProductsList,
  fetchProductInfoApi,
  fetchCategoriesList,
  addNewProductApi,
  sellingTransactionApi,
  purchaseTransactionApi,
  netProfitApi,
  fetchNotificationsApi,
  fetchUnreadNotificationsApi,
  markAsReadApi
};
