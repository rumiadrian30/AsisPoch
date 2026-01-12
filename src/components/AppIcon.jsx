// components/AppIcon.jsx
import React from 'react';
import {
  User,
  RefreshCw as Refresh,
  AlertTriangle,
  LayoutDashboard,
  ClipboardList,
  Map,
  Database,
  ExternalLink,
  Award,
  Clock,
  MapPin,
  UserMinus,
  Heart,
  X,
  HelpCircle,
  // Agregar los iconos que faltan
  Monitor,
  Navigation,
  MoreHorizontal,
  Menu,
  Phone,
  List,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Timer,
  PieChart,
  BarChart3,
  Users,
  ChevronDown,
  Maximize2,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Image,
  UserCheck,
  UserPlus,
  MessageSquare,
  Play,
  Check,
  Eye,
  FileText,
  Table,
  File
} from 'lucide-react';

// Mapeo de nombres personalizados a componentes
const iconMap = {
  User,
  Refresh,
  AlertTriangle,
  LayoutDashboard,
  ClipboardList,
  Map,
  Database,
  ExternalLink,
  Award,
  Clock,
  MapPin,
  UserMinus,
  Heart,
  X,
  HelpCircle,
  // Nuevos iconos agregados
  Monitor,
  Navigation,
  MoreHorizontal,
  Menu,
  Phone,
  List,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Timer,
  PieChart,
  BarChart3,
  Users,
  ChevronDown,
  Maximize2,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Image,
  UserCheck,
  UserPlus,
  MessageSquare,
  Play,
  Check,
  Eye,
  FileText,
  Table,
  File
};

function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}

export default Icon;