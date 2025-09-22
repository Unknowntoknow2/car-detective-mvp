
// Main Components Export - All consolidated components

// UI Components (explicitly import to avoid conflicts)
export { Button } from './ui/button';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Card, CardContent, CardHeader, CardTitle } from './ui/card';
export { Badge } from './ui/badge';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
export { Textarea } from './ui/textarea';
export { Checkbox } from './ui/checkbox';
export { RadioGroup, RadioGroupItem } from './ui/radio-group';
export { Switch } from './ui/switch';
export { Slider } from './ui/slider';
export { Progress } from './ui/progress';
export { Separator } from './ui/separator';
export { Skeleton } from './ui/skeleton';
export { Spinner } from './ui/spinner';
export { toast, useToast } from '@/hooks';
export { Toaster } from './ui/toaster';
export { Sonner } from './ui/sonner';

// Layout & Navigation
export { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

// Feedback & Display
export { Alert, AlertDescription, AlertTitle } from './ui/alert';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
export { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
export { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
export { Calendar } from './ui/calendar';
export { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
export { ContextMenu } from './ui/context-menu';
export { Menubar } from './ui/menubar';
export { NavigationMenu } from './ui/navigation-menu';
export { Pagination } from './ui/pagination';
export { ScrollArea } from './ui/scroll-area';
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

// Custom UI Components with unique names
export { PremiumBadge } from './ui/premium-badge';
export { EmptyState as UIEmptyState } from './ui/empty-state';
export { NoResults } from './ui/no-results';
export { ResourceHeader } from './ui/resource-header';
export { SkeletonSelect } from './ui/skeleton-select';

// Feature Components by Domain
export * from './valuation';
export * from './premium';
export * from './lookup';
export * from './dealer'; 
export * from './followup';

// Layout & Navigation
export * from './layout/Header';
export * from './layout/Footer';
export * from './layout/Navbar';
export * from './layout/MobileMenu';

// Common Components
export * from './common';

// Marketing Components
export * from './marketing';

// Navbar (consolidated)
export * from './navbar';

// Legacy domain re-exports
export * from './ui-kit';

// Resolve specific conflicts by explicitly importing and re-exporting with unique names
export { ValuationEmptyState } from './valuation/ValuationEmptyState';
export { PhotoUploadAndScore as ValuationPhotoUpload } from './valuation/PhotoUploadAndScore';
