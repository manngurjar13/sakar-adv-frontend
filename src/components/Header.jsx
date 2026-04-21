import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../store/slices/servicesSlice";
import logo from "../../public/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAdvertisingOpen, setIsAdvertisingOpen] = useState(false);
  const [mobileDropdownsOpen, setMobileDropdownsOpen] = useState({});
  const location = useLocation();
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.services);

  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length]);

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products", hasDropdown: true },
    { name: "Services", path: "/services", hasDropdown: true },
    { name: "Advertising", path: "/advertising", hasDropdown: true },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  // Create dynamic services dropdown from API
  const servicesDropdown = services.map((service) => ({
    name: service.service_name?.str1 || "Service",
    path: `/services/${(service.service_name?.str1 || "service").toLowerCase().replace(/\s+/g, "-")}`,
  }));

  const productsDropdown = [
    {
      name: "All Types Printing work",
      path: "/products/All-types-printing-work",
    },
    {
      name: "Advertisement Prosomal Items",
      path: "/products/advertisement-prosomal-items",
    },
    { name: "Canopy Printing", path: "/products/promo-tables" },
    { name: "Steady’s", path: "/products/Steady" },
    { name: "Flange Board", path: "/products/flange-board" },
    { name: "Sine Board’s", path: "/products/sine-board" },
  ];

  const advertisingDropdown = [
    { name: "Outdoor Hoardings", path: "/advertising/outdoor-hoardings" },
    { name: "Billboard Advertising", path: "/advertising/billboard" },
    { name: "Festival Banners", path: "/advertising/festival-banners" },
    { name: "Field Activation", path: "/advertising/field-activation" },
    { name: "BTL Campaigns", path: "/advertising/btl-campaigns" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMobileDropdown = (menuName) => {
    setMobileDropdownsOpen((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Helper function to split array into chunks based on item count
  const splitDropdownItems = (array) => {
    if (array.length <= 5) {
      // 5 या उससे कम items: single column
      return { showTwoColumns: false, firstColumn: array, secondColumn: [] };
    } else {
      // 6 या ज्यादा items: split into 2 columns
      const half = Math.ceil(array.length / 2);
      return {
        showTwoColumns: true,
        firstColumn: array.slice(0, half),
        secondColumn: array.slice(half),
      };
    }
  };

  // Split dropdowns
  const servicesSplit = splitDropdownItems(servicesDropdown);
  const productsSplit = splitDropdownItems(productsDropdown);
  const advertisingSplit = splitDropdownItems(advertisingDropdown);

  return (
    <>
      {/* Enhanced Top Bar with Modern Design */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 py-3 sm:py-2.5">
            {/* Social Media Icons - Enhanced */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-block text-white/80 text-xs font-medium mr-1">Follow Us:</span>
              <Link 
                to="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-blue-500 hover:border-blue-400 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-5 w-5 sm:h-5 sm:w-5 text-white group-hover:scale-110 transition-transform duration-300"
                >
                  <path fill="currentColor" d="M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z" />
                </svg>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  Facebook
                </div>
              </Link>
              
              <Link 
                to="https://google.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-red-500 hover:border-red-400 hover:scale-110 transition-all duration-300"
                aria-label="Google"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-5 w-5 sm:h-5 sm:w-5 text-white group-hover:scale-110 transition-transform duration-300"
                >
                  <path fill="currentColor" d="M386.3 292.5C388.1 302.2 389.4 311.9 389.4 324.5C389.4 434.3 315.8 512 205 512C98.9 512 13 426.1 13 320C13 213.9 98.9 128 205 128C256.9 128 300.1 146.9 333.6 178.3L281.5 228.3C267.4 214.7 242.5 198.7 205 198.7C139.5 198.7 86.1 252.9 86.1 320C86.1 387.1 139.5 441.3 205 441.3C281 441.3 309.5 386.6 314 358.5L205 358.5L205 292.5L386.3 292.5L386.3 292.5zM571.7 298.9L571.7 243.2L515.7 243.2L515.7 298.9L460 298.9L460 354.9L515.7 354.9L515.7 410.6L571.7 410.6L571.7 354.9L627.4 354.9L627.4 298.9L571.7 298.9z" />
                </svg>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  Google+
                </div>
              </Link>
              
              <Link 
                to="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-blue-600 hover:border-blue-500 hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-5 w-5 sm:h-5 sm:w-5 text-white group-hover:scale-110 transition-transform duration-300"
                >
                  <path fill="currentColor" d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM165 266.2L231.5 266.2L231.5 480L165 480L165 266.2zM236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160C219.5 160 236.7 177.2 236.7 198.5zM413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480L413.9 480z" />
                </svg>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  LinkedIn
                </div>
              </Link>
              
              <Link 
                to="https://youtube.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-red-600 hover:border-red-500 hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-5 w-5 sm:h-5 sm:w-5 text-white group-hover:scale-110 transition-transform duration-300"
                >
                  <path fill="currentColor" d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z" />
                </svg>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  YouTube
                </div>
              </Link>
            </div>
            
            {/* Phone Number - Enhanced Design */}
            <Link
              to={"tel:917566222215"}
              className="group inline-flex items-center gap-2 sm:gap-3 font-bold text-white bg-white/15 backdrop-blur-md rounded-full py-2 px-4 sm:py-2.5 sm:px-5 border border-white/30 hover:bg-white/25 hover:border-white/50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-5 w-5 sm:h-6 sm:w-6 relative z-10 text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300"
                >
                  <path fill="currentColor" d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base tracking-wide">+91 75662 22215</span>
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-3">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 group"
            >
              <div className="relative">
                <div>
                  <img src={logo} alt="logo" className="h-16 sm:h-14 w-full" />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div
                      onMouseEnter={() => {
                        if (item.name === "Products") {
                          setIsProductsOpen(true);
                          setIsServicesOpen(false);
                          setIsAdvertisingOpen(false);
                        } else if (item.name === "Services") {
                          setIsServicesOpen(true);
                          setIsProductsOpen(false);
                          setIsAdvertisingOpen(false);
                        } else if (item.name === "Advertising") {
                          setIsAdvertisingOpen(true);
                          setIsProductsOpen(false);
                          setIsServicesOpen(false);
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.name === "Products") {
                          setIsProductsOpen(false);
                        } else if (item.name === "Services") {
                          setIsServicesOpen(false);
                        } else if (item.name === "Advertising") {
                          setIsAdvertisingOpen(false);
                        }
                      }}
                    >
                      <button
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 flex items-center group ${
                          isActive(item.path)
                            ? "text-blue-600 bg-blue-50 shadow-sm"
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                        }`}
                      >
                        {item.name}
                        <svg
                          className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                            (
                              item.name === "Products"
                                ? isProductsOpen
                                : item.name === "Services"
                                ? isServicesOpen
                                : isAdvertisingOpen
                            )
                              ? "rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {(item.name === "Products"
                        ? isProductsOpen
                        : item.name === "Services"
                        ? isServicesOpen
                        : item.name === "Advertising"
                        ? isAdvertisingOpen
                        : false) && (
                        <div
                          className={`absolute top-full left-0 mt-0 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200 ${
                            (
                              item.name === "Products"
                                ? productsSplit.showTwoColumns
                                : item.name === "Services"
                                ? servicesSplit.showTwoColumns
                                : advertisingSplit.showTwoColumns
                            )
                              ? "w-[500px]"
                              : "w-72"
                          }`}
                        >
                          <div
                            className={`${
                              (
                                item.name === "Products"
                                  ? productsSplit.showTwoColumns
                                  : item.name === "Services"
                                  ? servicesSplit.showTwoColumns
                                  : advertisingSplit.showTwoColumns
                              )
                                ? "flex px-2"
                                : ""
                            }`}
                          >
                            {/* First Column */}
                            <div
                              className={`${
                                (
                                  item.name === "Products"
                                    ? productsSplit.showTwoColumns
                                    : item.name === "Services"
                                    ? servicesSplit.showTwoColumns
                                    : advertisingSplit.showTwoColumns
                                )
                                  ? "w-1/2 pr-2 border-r border-gray-200"
                                  : ""
                              }`}
                            >
                              <div className="px-2">
                                {(item.name === "Products"
                                  ? productsSplit.firstColumn
                                  : item.name === "Services"
                                  ? servicesSplit.firstColumn
                                  : advertisingSplit.firstColumn
                                ).map((dropdownItem, index) => (
                                  <Link
                                    key={dropdownItem.name}
                                    to={dropdownItem.path}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                                  >
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                                      {item.name === "Products" ? (
                                        index === 0 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                            />
                                          </svg>
                                        ) : index === 1 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                          </svg>
                                        ) : index === 2 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                          </svg>
                                        ) : index === 3 ? (
                                          <svg
                                            class="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                            />
                                          </svg>
                                        ) : index === 4 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                            />
                                          </svg>
                                        ) : (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                            />
                                          </svg>
                                        )
                                      ) : item.name === "Advertising" ? (
                                        index === 0 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                          </svg>
                                        ) : index === 1 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                          </svg>
                                        ) : index === 2 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                          </svg>
                                        ) : index === 3 ? (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                          </svg>
                                        ) : (
                                          <svg
                                            className="w-4 h-4 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                            />
                                          </svg>
                                        )
                                      ) : index === 0 ? (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                          />
                                        </svg>
                                      ) : index === 1 ? (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                          />
                                        </svg>
                                      ) : index === 2 ? (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                          />
                                        </svg>
                                      ) : index === 3 ? (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                          />
                                        </svg>
                                      ) : index === 4 ? (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                          />
                                        </svg>
                                      ) : index === 5 ? (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                          />
                                        </svg>
                                      ) : index === 6 ? (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {dropdownItem.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Learn more
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Second Column - Only show if showTwoColumns is true */}
                            {(item.name === "Products"
                              ? productsSplit.showTwoColumns
                              : item.name === "Services"
                              ? servicesSplit.showTwoColumns
                              : advertisingSplit.showTwoColumns) && (
                              <div className="w-1/2 pl-2">
                                <div className="px-2">
                                  {(item.name === "Products"
                                    ? productsSplit.secondColumn
                                    : item.name === "Services"
                                    ? servicesSplit.secondColumn
                                    : advertisingSplit.secondColumn
                                  ).map((dropdownItem, index) => {
                                    const baseIndex =
                                      item.name === "Products"
                                        ? productsSplit.firstColumn.length
                                        : item.name === "Services"
                                        ? servicesSplit.firstColumn.length
                                        : advertisingSplit.firstColumn.length;
                                    const actualIndex = baseIndex + index;

                                    return (
                                      <Link
                                        key={dropdownItem.name}
                                        to={dropdownItem.path}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                                      >
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                                          {item.name === "Products" ? (
                                            actualIndex === 5 ? (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                />
                                              </svg>
                                            ) : (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                />
                                              </svg>
                                            )
                                          ) : item.name === "Services" ? (
                                            actualIndex === 5 ? (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                                                />
                                              </svg>
                                            ) : actualIndex === 6 ? (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                                />
                                              </svg>
                                            ) : actualIndex === 7 ? (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                />
                                              </svg>
                                            ) : actualIndex === 8 ? (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                />
                                              </svg>
                                            ) : actualIndex === 9 ? (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                              </svg>
                                            ) : (
                                              <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                                />
                                              </svg>
                                            )
                                          ) : // Advertising icons for second column
                                          actualIndex === 5 ? (
                                            <svg
                                              className="w-4 h-4 text-blue-600"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                              />
                                            </svg>
                                          ) : (
                                            <svg
                                              className="w-4 h-4 text-blue-600"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                              />
                                            </svg>
                                          )}
                                        </div>
                                        <div>
                                          <div className="font-medium">
                                            {dropdownItem.name}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Learn more
                                          </div>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 ${
                        isActive(item.path)
                          ? "text-blue-600 bg-blue-50 shadow-sm"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="sm:hidden pb-4 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 pt-4 pb-4 space-y-2 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl border border-blue-100 mt-2 max-sm:overflow-auto max-sm:h-[calc(100vh_-_113px)]">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleMobileDropdown(item.name)}
                          className={`flex items-center justify-between w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 ${
                            isActive(item.path)
                              ? "text-blue-600 bg-blue-100 shadow-sm"
                              : "text-gray-700 hover:text-blue-600 hover:bg-white/80"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              {item.name === "Products" ? (
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                  />
                                </svg>
                              ) : item.name === "Services" ? (
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                  />
                                </svg>
                              )}
                            </div>
                            {item.name}
                          </div>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileDropdownsOpen[item.name] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {mobileDropdownsOpen[item.name] && (
                          <div className="ml-11 mt-2 space-y-1">
                            {(item.name === "Products"
                              ? productsDropdown
                              : item.name === "Services"
                              ? servicesDropdown
                              : advertisingDropdown
                            ).map((dropdownItem, index) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-white/60 transition-all duration-200"
                              >
                                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                  {item.name === "Products" ? (
                                    index === 0 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                                        />
                                      </svg>
                                    ) : index === 1 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    ) : index === 2 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                      </svg>
                                    ) : index === 3 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                      </svg>
                                    ) : index === 4 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                      </svg>
                                    )
                                  ) : item.name === "Services" ? (
                                    index === 0 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                      </svg>
                                    ) : index === 1 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
                                      </svg>
                                    ) : index === 2 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                      </svg>
                                    ) : index === 3 ? (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-3 h-3 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
                                      </svg>
                                    )
                                  ) : // Advertising Icons
                                  index === 0 ? (
                                    <svg
                                      className="w-3 h-3 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                      />
                                    </svg>
                                  ) : index === 1 ? (
                                    <svg
                                      className="w-3 h-3 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                      />
                                    </svg>
                                  ) : index === 2 ? (
                                    <svg
                                      className="w-3 h-3 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                      />
                                    </svg>
                                  ) : index === 3 ? (
                                    <svg
                                      className="w-3 h-3 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-3 h-3 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    </svg>
                                  )}
                                </div>
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                          isActive(item.path)
                            ? "text-blue-600 bg-blue-100 shadow-sm"
                            : "text-gray-700 hover:text-blue-600 hover:bg-white/80"
                        }`}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          {item.name === "Home" ? (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                          ) : item.name === "Portfolio" ? (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          ) : item.name === "Events" ? (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          )}
                        </div>
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
