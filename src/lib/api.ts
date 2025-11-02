// Mock API service that simulates the Speaker Companion API
// Ready to swap with real API endpoint

const API_BASE_URL = 'http://localhost:8000/api/v1';
const USE_MOCK = true; // Set to false when real API is ready

// Types based on API spec
export type AnalysisStatus = 
  | 'queued' 
  | 'preprocessing_video' 
  | 'detecting_pose' 
  | 'extracting_features'
  | 'analyzing_pose'
  | 'generating_overlay'
  | 'generating_report'
  | 'completed' 
  | 'failed';

export interface AnalysisListItem {
  id: string;
  status: AnalysisStatus;
  created_at: string;
  completed_at: string | null;
  video_filename: string;
  title: string | null;
  duration_seconds: number;
  overall_score: number | null;
  overall_rating: string | null;
  progress_pct: number;
  thumbnail_url: string | null;
  video_overlay_url: string | null;
}

export interface AnalysisStatusResponse {
  analysis_id: string;
  status: AnalysisStatus;
  progress_pct: number;
  current_step: string;
  estimated_time_remaining_seconds: number | null;
}

export interface AnalysisResult {
  id: string;
  status: AnalysisStatus;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  processing_time_seconds: number | null;
  video: {
    filename: string;
    duration_seconds: number;
    fps: number;
    resolution: [number, number];
    file_size_bytes: number;
    format: string;
    uploaded_at: string;
    title?: string | null;
  };
  config: {
    skip_intro_seconds: number;
    target_fps: number;
    generate_overlay_video: boolean;
    audio_format: string;
  };
  overall_score: number | null;
  overall_rating: string | null;
  pose_analysis: {
    overall_score: number;
    rating: string;
    total_frames_analyzed: number;
    frames_with_pose: number;
    detection_confidence_avg: number;
    eye_contact: {
      level_pct: number;
      up_pct: number;
      down_pct: number;
      away_pct: number;
      center_pct: number;
      left_pct: number;
      right_pct: number;
      score: number;
    };
    gestures: {
      total_count: number;
      open_hands_pct: number;
      hand_above_waist_pct: number;
      gestures_per_minute: number;
      hand_positions: Record<string, number>;
      score: number;
    };
    movement: {
      movement_pct: number;
      stationary_pct: number;
      stage_coverage_pct: number;
      avg_movement_duration_seconds: number;
      transitions_count: number;
      score: number;
    };
    posture: {
      dominant_posture: string;
      posture_distribution: Record<string, number>;
      posture_variety_score: number;
      score: number;
    };
  } | null;
  audio_analysis: null;
  timeline: Array<{
    minute: number;
    start_time: string;
    end_time: string;
    vertical_gaze: Record<string, number>;
    horizontal_gaze: Record<string, number>;
    movement_pct: number;
    stationary_pct: number;
    gesture_activity_pct: number;
    top_postures: Record<string, number>;
  }>;
  recommendations: Array<{
    id: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    issue: string;
    suggestion: string;
    timestamp_start: number | null;
    timestamp_end: number | null;
    is_cross_analysis: boolean;
  }>;
  video_original_url: string;
  video_overlay_url: string | null;
  audio_url: string | null;
}

export interface UploadConfig {
  title?: string;
  skip_intro_seconds?: number;
  target_fps?: number;
  generate_overlay_video?: boolean;
  audio_format?: 'wav' | 'mp3';
}

// Mock data generator
const generateMockAnalysis = (id: string, status: AnalysisStatus = 'completed'): AnalysisResult => {
  const isCompleted = status === 'completed';
  const score = isCompleted ? Math.floor(Math.random() * 30) + 70 : null;
  
  return {
    id,
    status,
    created_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    started_at: isCompleted ? new Date(Date.now() - Math.random() * 3600000).toISOString() : null,
    completed_at: isCompleted ? new Date(Date.now() - Math.random() * 1800000).toISOString() : null,
    processing_time_seconds: isCompleted ? Math.floor(Math.random() * 300) + 120 : null,
    video: {
      filename: `speech_${id.slice(0, 8)}.mp4`,
      duration_seconds: Math.floor(Math.random() * 600) + 180,
      fps: 30,
      resolution: [1920, 1080],
      file_size_bytes: Math.floor(Math.random() * 100000000) + 10000000,
      format: 'mp4',
      uploaded_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      title: Math.random() > 0.5 ? `Presentation ${id.slice(0, 4)}` : null,
    },
    config: {
      skip_intro_seconds: 10,
      target_fps: 10,
      generate_overlay_video: true,
      audio_format: 'wav',
    },
    overall_score: score,
    overall_rating: score ? (score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work') : null,
    pose_analysis: isCompleted ? {
      overall_score: score!,
      rating: score! >= 85 ? 'Excellent' : score! >= 70 ? 'Good' : 'Needs Work',
      total_frames_analyzed: 2500,
      frames_with_pose: 2450,
      detection_confidence_avg: 0.89,
      eye_contact: {
        level_pct: 65,
        up_pct: 8,
        down_pct: 20,
        away_pct: 7,
        center_pct: 45,
        left_pct: 28,
        right_pct: 20,
        score: Math.floor(Math.random() * 20) + 70,
      },
      gestures: {
        total_count: 140,
        open_hands_pct: 68,
        hand_above_waist_pct: 82,
        gestures_per_minute: 20,
        hand_positions: {
          spread: 42,
          on_torso: 28,
          pointing: 15,
          clasped: 9,
          pockets: 6,
        },
        score: Math.floor(Math.random() * 20) + 75,
      },
      movement: {
        movement_pct: 36,
        stationary_pct: 64,
        stage_coverage_pct: 58,
        avg_movement_duration_seconds: 3.2,
        transitions_count: 15,
        score: Math.floor(Math.random() * 20) + 70,
      },
      posture: {
        dominant_posture: 'L:spread+R:spread',
        posture_distribution: {
          'L:spread+R:spread': 35,
          'L:spread+R:on_torso': 23,
          'L:on_torso+R:spread': 19,
          'L:on_torso+R:on_torso': 12,
          'other': 11,
        },
        posture_variety_score: 72,
        score: Math.floor(Math.random() * 20) + 75,
      },
    } : null,
    audio_analysis: null,
    timeline: isCompleted ? Array.from({ length: 7 }, (_, i) => ({
      minute: i + 1,
      start_time: `${i}:00`,
      end_time: `${i + 1}:00`,
      vertical_gaze: { up: 0, level: 86, down: 0, away: 14 },
      horizontal_gaze: { left: 22, 'center-left': 19, center: 29, 'center-right': 16, right: 0, away: 14 },
      movement_pct: 45,
      stationary_pct: 55,
      gesture_activity_pct: 86,
      top_postures: { 'L:spread+R:spread': 21, 'L:spread+R:on_torso': 17 },
    })) : [],
    recommendations: isCompleted ? [
      {
        id: 'rec_001',
        category: 'eye_contact',
        priority: 'medium',
        issue: 'Looking down 20% of the time',
        suggestion: 'Practice maintaining eye level gaze. Try placing sticky notes at eye level around the room.',
        timestamp_start: null,
        timestamp_end: null,
        is_cross_analysis: false,
      },
      {
        id: 'rec_002',
        category: 'movement',
        priority: 'low',
        issue: 'Stage coverage at 58% - some areas underutilized',
        suggestion: 'Plan intentional movements to different stage areas to connect with all audience sections.',
        timestamp_start: null,
        timestamp_end: null,
        is_cross_analysis: false,
      },
    ] : [],
    video_original_url: `/storage/uploads/${id}/video.mp4`,
    video_overlay_url: isCompleted ? `/storage/results/${id}/overlay.mp4` : null,
    audio_url: isCompleted ? `/storage/intermediate/${id}/audio.wav` : null,
  };
};

// Mock analyses storage
let mockAnalyses: AnalysisResult[] = [
  generateMockAnalysis('550e8400-e29b-41d4-a716-446655440001', 'completed'),
  generateMockAnalysis('550e8400-e29b-41d4-a716-446655440002', 'completed'),
  generateMockAnalysis('550e8400-e29b-41d4-a716-446655440003', 'detecting_pose'),
  generateMockAnalysis('550e8400-e29b-41d4-a716-446655440004', 'completed'),
  generateMockAnalysis('550e8400-e29b-41d4-a716-446655440005', 'completed'),
];

// API functions
export const api = {
  async uploadVideo(file: File, config: UploadConfig = {}) {
    if (USE_MOCK) {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newId = crypto.randomUUID();
      const newAnalysis = generateMockAnalysis(newId, 'queued');
      newAnalysis.video.filename = file.name;
      newAnalysis.video.title = config.title || null;
      mockAnalyses.unshift(newAnalysis);
      
      // Simulate processing
      setTimeout(() => {
        const analysis = mockAnalyses.find(a => a.id === newId);
        if (analysis) {
          analysis.status = 'preprocessing_video';
        }
      }, 2000);
      
      setTimeout(() => {
        const analysis = mockAnalyses.find(a => a.id === newId);
        if (analysis) {
          analysis.status = 'detecting_pose';
        }
      }, 5000);
      
      setTimeout(() => {
        const analysis = mockAnalyses.find(a => a.id === newId);
        if (analysis) {
          const completedAnalysis = generateMockAnalysis(newId, 'completed');
          completedAnalysis.video.filename = file.name;
          completedAnalysis.video.title = config.title || null;
          Object.assign(analysis, completedAnalysis);
        }
      }, 15000);
      
      return { analysis_id: newId, status: 'queued', message: 'Analysis queued successfully' };
    }
    
    const formData = new FormData();
    formData.append('video', file);
    if (config.title) formData.append('title', config.title);
    if (config.skip_intro_seconds) formData.append('skip_intro_seconds', config.skip_intro_seconds.toString());
    if (config.target_fps) formData.append('target_fps', config.target_fps.toString());
    if (config.generate_overlay_video !== undefined) formData.append('generate_overlay_video', config.generate_overlay_video.toString());
    if (config.audio_format) formData.append('audio_format', config.audio_format);
    
    const response = await fetch(`${API_BASE_URL}/analyses`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  async getAnalysisStatus(analysisId: string): Promise<AnalysisStatusResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const analysis = mockAnalyses.find(a => a.id === analysisId);
      if (!analysis) throw new Error('Analysis not found');
      
      const statusMap: Record<AnalysisStatus, { step: string; progress: number }> = {
        queued: { step: 'Waiting to start...', progress: 0 },
        preprocessing_video: { step: 'Preprocessing video...', progress: 15 },
        detecting_pose: { step: 'Detecting pose...', progress: 40 },
        extracting_features: { step: 'Extracting features...', progress: 60 },
        analyzing_pose: { step: 'Analyzing pose...', progress: 75 },
        generating_overlay: { step: 'Generating overlay video...', progress: 90 },
        generating_report: { step: 'Creating report...', progress: 98 },
        completed: { step: 'Complete!', progress: 100 },
        failed: { step: 'Failed', progress: 0 },
      };
      
      const { step, progress } = statusMap[analysis.status];
      
      return {
        analysis_id: analysisId,
        status: analysis.status,
        progress_pct: progress,
        current_step: step,
        estimated_time_remaining_seconds: analysis.status === 'completed' ? 0 : 120,
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}/status`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  },

  async getAnalysis(analysisId: string): Promise<AnalysisResult> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analysis = mockAnalyses.find(a => a.id === analysisId);
      if (!analysis) throw new Error('Analysis not found');
      return analysis;
    }
    
    const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}`);
    if (!response.ok) throw new Error('Failed to fetch analysis');
    return response.json();
  },

  async listAnalyses(page = 1, pageSize = 20, status?: AnalysisStatus) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let filtered = [...mockAnalyses];
      if (status) {
        filtered = filtered.filter(a => a.status === status);
      }
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginated = filtered.slice(start, end);
      
      return {
        analyses: paginated.map(a => ({
          id: a.id,
          status: a.status,
          created_at: a.created_at,
          completed_at: a.completed_at,
          video_filename: a.video.filename,
          title: a.video.title,
          duration_seconds: a.video.duration_seconds,
          overall_score: a.overall_score,
          overall_rating: a.overall_rating,
          progress_pct: a.status === 'completed' ? 100 : Math.random() * 80,
          thumbnail_url: null,
          video_overlay_url: a.video_overlay_url,
        })) as AnalysisListItem[],
        total: filtered.length,
        page,
        page_size: pageSize,
      };
    }
    
    const params = new URLSearchParams({ page: page.toString(), page_size: pageSize.toString() });
    if (status) params.append('status', status);
    
    const response = await fetch(`${API_BASE_URL}/analyses?${params}`);
    if (!response.ok) throw new Error('Failed to fetch analyses');
    return response.json();
  },
};
