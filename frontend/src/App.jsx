import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AIProvider } from './context/AIContext';
import Layout from './components/layout/Layout';
import Playground from './pages/Playground';
import CustomCursor from './components/ui/CustomCursor';

export default function App() {
  return (
    <AIProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Playground />} />
            <Route path="/config" element={<Playground />} />
            <Route path="/scenarios" element={<Playground />} />
            <Route path="/logs" element={<Playground />} />
            <Route path="/stress" element={<Playground />} />
            <Route path="/generator" element={<Playground />} />
          </Routes>
        </Layout>
        <CustomCursor />
      </BrowserRouter>
    </AIProvider>
  );
}
