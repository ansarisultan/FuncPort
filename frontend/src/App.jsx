import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AIProvider } from './context/AIContext';
import Layout from './components/layout/Layout';
import Playground from './pages/Playground';
import Landing from './pages/Landing';
import CustomCursor from './components/ui/CustomCursor';

export default function App() {
  return (
    <AIProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page - FuncPort */}
          <Route path="/" element={<Landing />} />
          
          {/* App Routes - FuncLexa Assets */}
          <Route path="/app/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Playground />} />
                <Route path="/config" element={<Playground />} />
                <Route path="/logs" element={<Playground />} />
                <Route path="/stress" element={<Playground />} />
                <Route path="/scenarios" element={<Playground />} />
                <Route path="/generator" element={<Playground />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <CustomCursor />
      </BrowserRouter>
    </AIProvider>
  );
}
