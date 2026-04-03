import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Schools from './pages/Schools';
import SchoolDetail from './pages/SchoolDetail';
import Consultants from './pages/Consultants';
import ConsultantDetail from './pages/ConsultantDetail';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import Apply from './pages/Apply';
import Competition from './pages/Competition';
import CompetitionDetail from './pages/CompetitionDetail';
import Research from './pages/Research';
import Appointment from './pages/Appointment';
import StudyNews from './pages/StudyNews';
import Header from './components/Header';
import Footer from './components/Footer';

// 英语培训模块页面
import EnglishTraining from './pages/EnglishTraining';
import PracticeHome from './pages/PracticeHome';
import PracticeExam from './pages/PracticeExam';
import ExamReport from './pages/ExamReport';
import WrongBook from './pages/WrongBook';
import Leaderboard from './pages/Leaderboard';

// 错误边界
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', minHeight: '60vh' }}>
          <h1 style={{ color: 'red', marginBottom: '20px' }}>页面出错了</h1>
          <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '20px', overflow: 'auto', borderRadius: '8px' }}>
            {this.state.error?.toString()}
          </pre>
          <div style={{ marginTop: '20px' }}>
            <a href="/" style={{ color: '#3b82f6' }}>返回首页</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/schools/:id" element={<SchoolDetail />} />
              <Route path="/consultants" element={<Consultants />} />
              <Route path="/consultants/:id" element={<ConsultantDetail />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/english-training" element={<EnglishTraining />} />
              <Route path="/competition" element={<Competition />} />
              <Route path="/competition/:slug" element={<CompetitionDetail />} />
              <Route path="/research" element={<Research />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/study-news" element={<StudyNews />} />
              <Route path="/study-news/:id" element={<StudyNews />} />
              {/* 英语培训模块 */}
              <Route path="/english-training" element={<EnglishTraining />} />
              <Route path="/english-training/practice" element={<PracticeHome />} />
              <Route path="/english-training/exam" element={<PracticeExam />} />
              <Route path="/english-training/report/:examId" element={<ExamReport />} />
              <Route path="/english-training/wrong-book" element={<WrongBook />} />
              <Route path="/english-training/leaderboard" element={<Leaderboard />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
