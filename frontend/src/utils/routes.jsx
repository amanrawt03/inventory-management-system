const api = "http://localhost:3000/api";
const login = `${api}/auth/login`;

// location
const fetchLocationsApi = `${api}/inventory/paginate`;
const fetchLocationsList = `${api}/inventory`;
const createLocationApi = `${api}/inventory`;

// product
const fetchCostPriceApi = `${api}/product/costPrice`;
const fetchItemsApi = `${api}/product/paginate`;
const fetchProductsList = `${api}/product`;
const addNewProductApi = `${api}/product`;

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
const createCustomerApi = `${api}/customer`

// transaction
const sellItemsApi = `${api}/transaction/sellItems`;
const purchaseItemsApi = `${api}/transaction/purchaseItems`;
const sellingTransactionApi = `${api}/transaction/sellingTransaction`;
const purchaseTransactionApi = `${api}/transaction/purchaseTransaction`;

export {
  login,
  fetchCategoriesApi,
  fetchItemsApi,
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
  fetchCategoriesList,
  addNewProductApi,
  sellingTransactionApi,
  purchaseTransactionApi
};
