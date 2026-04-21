import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Advertising from "./pages/Advertising";
import Events from "./pages/Events";

// Admin Components
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import EventsList from "./pages/admin/EventsList";
import EventForm from "./pages/admin/EventForm";
import TestimonialsList from "./pages/admin/TestimonialsList";
import TestimonialForm from "./pages/admin/TestimonialForm";
import PortfolioList from "./pages/admin/PortfolioList";
import PortfolioForm from "./pages/admin/PortfolioForm";
import ContactsList from "./pages/admin/ContactsList";
import ContactConfig from "./pages/admin/ContactConfig";
import EventBannerList from "./pages/admin/EventBannerList";
import UpcomingEventList from "./pages/admin/UpcomingEventList";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ServicesList from "./pages/admin/ServicesList";
import DynamicServiceDetail from "./pages/services/DynamicServiceDetail";

// Public service subpages
import VehicleBranding from "./pages/services/VehicleBranding";
import AutoRickshaw from "./pages/services/AutoRickshaw";
import ERickshawBranding from "./pages/services/ERickshawBranding";
import BusAdvertising from "./pages/services/BusAdvertising";
import MobileVan from "./pages/services/MobileVan";

// Public product subpages
import NoParkingBoards from "./pages/products/NoParkingBoards";
import RollUpBanners from "./pages/products/RollUpBanners";
import PromoTables from "./pages/products/PromoTables";
import LEDSignage from "./pages/products/LEDSignage";
import FlexPrinting from "./pages/products/FlexPrinting";
import GlowSigns from "./pages/products/GlowSigns";

// Public advertising subpages
import OutdoorHoardings from "./pages/advertising/OutdoorHoardings";
import Billboard from "./pages/advertising/Billboard";
import FestivalBanners from "./pages/advertising/FestivalBanners";
import FieldActivation from "./pages/advertising/FieldActivation";
import BTLCampaigns from "./pages/advertising/BTLCampaigns";
import NoParkingBoard from "./pages/services/NoParkingBoard";
import Holding from "./pages/services/Holding";
import WallPanting from "./pages/services/WallPanting";
import LookwalkerActivity from "./pages/services/LookwalkerActivity";
import NewspaperInsertion from "./pages/services/NewspaperInsertion";
import AllTypesPrintingWork from "./pages/products/AllTypesPrintingWork";
import Standy from "./pages/products/Standy";
import FlangeBoard from "./pages/products/FlangeBoard";
import ServiceForm from "./pages/admin/ServiceForm";

function AppLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Public routes - with header and footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
        persistor={persistor}
      >
        <Router>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/advertising" element={<Advertising />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={<Navigate to="/admin/events" replace />}
              />

              {/* Admin Events Routes */}
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <EventsList />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/create"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <EventForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/create-upcoming"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <EventForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <EventForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <EventForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Testimonials Routes */}
              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <TestimonialsList />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials/create"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <TestimonialForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials/:id"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <TestimonialForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <TestimonialForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Portfolio Routes */}
              <Route
                path="/admin/portfolio"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <PortfolioList />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio/create"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <PortfolioForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio/:id"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <PortfolioForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <PortfolioForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Contacts Routes */}
              <Route
                path="/admin/contacts"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ContactsList />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Contact Configuration Routes */}
              <Route
                path="/admin/contact-config"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ContactConfig />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              {/* Admin Services Routes */}
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ServicesList />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services/create"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ServiceForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services/:id"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ServiceForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ServiceForm />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Event Management Routes */}
              <Route
                path="/admin/event-banners"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <EventBannerList />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/upcoming-events"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UpcomingEventList />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect removed admin modules to events page */}
              <Route
                path="/admin/products"
                element={<Navigate to="/admin/events" replace />}
              />
              <Route
                path="/admin/advertising"
                element={<Navigate to="/admin/events" replace />}
              />

              {/* Legacy Service Submenu Routes (kept for backwards compatibility) */}
              <Route
                path="/services/vehicle-branding"
                element={<VehicleBranding />}
              />
              <Route
                path="/services/auto-rickshaw"
                element={<AutoRickshaw />}
              />
              <Route
                path="/services/e-rickshaw"
                element={<ERickshawBranding />}
              />
              <Route
                path="/services/bus-advertising"
                element={<BusAdvertising />}
              />
              <Route path="/services/mobile-van" element={<MobileVan />} />
              <Route
                path="/services/no-parking-board"
                element={<NoParkingBoard />}
              />
              <Route path="/services/hoarding" element={<Holding />} />
              <Route path="/services/wall-panting" element={<WallPanting />} />
              <Route
                path="/services/lookwalker-activity"
                element={<LookwalkerActivity />}
              />
              <Route
                path="/services/newspaper-insertion"
                element={<NewspaperInsertion />}
              />

              {/* Dynamic Service Detail Route (matches any other service slug) */}
              <Route
                path="/services/:slug"
                element={<DynamicServiceDetail />}
              />

              {/* Product Submenu Routes */}
              <Route
                path="/products/All-types-printing-work"
                element={<AllTypesPrintingWork />}
              />
              <Route
                path="/products/advertisement-prosomal-items"
                element={<RollUpBanners />}
              />
              <Route path="/products/promo-tables" element={<PromoTables />} />
              <Route path="/products/Steady" element={<Standy />} />
              <Route path="/products/flange-board" element={<FlangeBoard />} />
              <Route path="/products/sine-board" element={<GlowSigns />} />

              {/* Advertising Submenu Routes */}
              <Route
                path="/advertising/outdoor-hoardings"
                element={<OutdoorHoardings />}
              />
              <Route path="/advertising/billboard" element={<Billboard />} />
              <Route
                path="/advertising/festival-banners"
                element={<FestivalBanners />}
              />
              <Route
                path="/advertising/field-activation"
                element={<FieldActivation />}
              />
              <Route
                path="/advertising/btl-campaigns"
                element={<BTLCampaigns />}
              />
            </Routes>
          </AppLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
