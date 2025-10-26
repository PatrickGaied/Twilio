import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, TrendingUp, DollarSign, Target, Plus, Filter, Search, ArrowUpRight, ArrowDownRight, Zap, Mail, Calendar, ShoppingCart, Eye, MousePointer, Smartphone, Edit3, Send, Clock, BarChart3, TrendingDown, AlertCircle, Settings, ChevronRight, Star, Activity, Percent, Package, Sparkles, ImageIcon, AlertTriangle, CheckCircle, X } from 'lucide-react'
import ProductSegmentInsights from '../components/ProductSegmentInsights'
import CampaignModal from '../components/CampaignModal'
import PopupAdCreator from '../components/PopupAdCreator'
import ThemeToggle from '../components/ThemeToggle'

interface CustomerSegment {
  id: string
  name: string
  type: string
  description: string
  customer_count: number
  criteria: any
  created_at: string
  updated_at: string
}

interface Customer {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  segment_ids: string[]
  total_orders: number
  total_spent: number
  last_activity: string
  conversion_rate: number
  lifetime_value: number
}

export default function SegmentsPage() {
