'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceRecorderProps {
  onSendVoice: (audioBlob: Blob) => void
  onCancel: () => void
}

export function VoiceRecorder({ onSendVoice, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(true)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start recording on mount
  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          setAudioBlob(blob)
          stream.getTracks().forEach(track => track.stop())
        }

        mediaRecorder.start()
        setDuration(0)

        durationIntervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1)
        }, 1000)
      } catch (error) {
        console.error('Error accessing microphone:', error)
        onCancel()
      }
    }

    startRecording()

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [])

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSend = () => {
    if (audioBlob) {
      onSendVoice(audioBlob)
    }
  }

  const handleDelete = () => {
    setAudioBlob(null)
    setDuration(0)
    setIsRecording(true)
  }

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 w-full">
      <div className="flex items-center gap-3 flex-1">
        {isRecording ? (
          <>
            {/* Animated recording indicator */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm font-semibold text-red-600 font-mono">{formatTime(duration)}</span>
          </>
        ) : (
          <>
            <Mic className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 font-mono">{formatTime(duration)}</span>
          </>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-2">
        {isRecording ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={stopRecording}
            className="hover:bg-red-100 text-red-600"
          >
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="hover:bg-red-100 text-red-600"
              title="Delete recording"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              title="Send voice message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
