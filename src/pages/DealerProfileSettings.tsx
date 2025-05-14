
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Save, X, Upload, ShieldCheck, Bell, Building2, User } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const DealerProfileSettings = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile information state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dealer profile mock data
  const [profile, setProfile] = useState({
    fullName: "",
    businessName: "",
    email: "dealer@example.com",
    phone: "",
    address: "",
    dealerLicense: "",
    state: "",
    dealerType: "independent",
    taxId: "",
    twoFactorEnabled: false,
    notifyInventoryViewed: true,
    notifySmsLeads: false,
    notifyPush: true
  });
  
  // Security information
  const [securityInfo, setSecurityInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Avatar/Logo handling
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Document state 
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  
  // Simulated data loading
  useState(() => {
    const timer = setTimeout(() => {
      setProfile({
        fullName: "Alex Thompson",
        businessName: "Thompson Auto Group",
        email: "alex@thompsonauto.com",
        phone: "(555) 123-4567",
        address: "123 Main Street, Anytown, CA 90210",
        dealerLicense: "DL-12345678",
        state: "CA",
        dealerType: "franchise",
        taxId: "XX-XXXXXXX",
        twoFactorEnabled: true,
        notifyInventoryViewed: true,
        notifySmsLeads: true,
        notifyPush: false
      });
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  });
  
  // Activity log mock data
  const activityLog = [
    { id: 1, action: "Login", ip: "192.168.1.1", browser: "Chrome on macOS", timestamp: "Today at 10:23 AM" },
    { id: 2, action: "Password Changed", ip: "192.168.1.1", browser: "Chrome on macOS", timestamp: "May 14, 2023 at 3:45 PM" },
    { id: 3, action: "Login", ip: "72.34.112.45", browser: "Safari on iOS", timestamp: "May 10, 2023 at 9:12 AM" },
  ];
  
  // Mock handlers
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate saving data
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }, 1500);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Simulate upload success
      setTimeout(() => {
        toast.success("Logo updated successfully");
      }, 1000);
    }
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
      setIsDocumentUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        setIsDocumentUploading(false);
        toast.success("Document uploaded successfully");
      }, 2000);
    }
  };
  
  const handlePasswordChange = () => {
    // Validate passwords match
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    // Simulate saving
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurityInfo({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully");
    }, 1500);
  };
  
  const handleTwoFactorToggle = () => {
    setProfile(prev => ({
      ...prev, 
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
    
    toast.success(`Two-factor authentication ${profile.twoFactorEnabled ? 'disabled' : 'enabled'}`);
  };
  
  const handleNotificationChange = (key: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    
    toast.success("Notification preferences updated");
  };
  
  // Transition animation properties
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Dealer Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your dealership information, preferences, and security settings
        </p>
      </motion.div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Avatar/Logo Upload */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    {isLoading ? (
                      <Skeleton className="h-32 w-32 rounded-full" />
                    ) : (
                      <div className="relative group">
                        <Avatar className="h-32 w-32 border-2 border-border">
                          <AvatarImage 
                            src={avatarPreview || "https://ui-avatars.com/api/?name=Thompson+Auto&background=0062FF&color=fff"} 
                            alt="Dealer logo"
                          />
                          <AvatarFallback className="text-2xl">TA</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <label htmlFor="avatar-upload" className="cursor-pointer text-white text-sm font-medium">
                            Change Logo
                          </label>
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Dealership Logo</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your business logo or profile picture
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Button variant="outline" className="w-full" asChild>
                        <label className="cursor-pointer">
                          Upload New Logo
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </Button>
                      {avatarPreview && (
                        <Button 
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            setAvatarFile(null);
                            setAvatarPreview(null);
                          }}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Profile Information */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!isEditing ? (
                      <Button 
                        onClick={handleEditToggle}
                        variant="outline"
                        size="sm"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleCancelEdit}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveProfile}
                          variant="default"
                          size="sm"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input 
                          value={profile.fullName} 
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Business Name</label>
                        <Input 
                          value={profile.businessName} 
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                          placeholder="Your business name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input 
                          value={profile.email} 
                          disabled={true}
                          className="bg-muted"
                          placeholder="Your email"
                        />
                        <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          value={profile.phone} 
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Dealership Address</label>
                        <Input 
                          value={profile.address} 
                          disabled={!isEditing}
                          onChange={(e) => setProfile({...profile, address: e.target.value})}
                          placeholder="Your business address"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-8"
          >
            {/* Change Password */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input 
                        type="password"
                        value={securityInfo.oldPassword}
                        onChange={(e) => setSecurityInfo({...securityInfo, oldPassword: e.target.value})}
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-1"></div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input 
                        type="password"
                        value={securityInfo.newPassword}
                        onChange={(e) => setSecurityInfo({...securityInfo, newPassword: e.target.value})}
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input 
                        type="password"
                        value={securityInfo.confirmPassword}
                        onChange={(e) => setSecurityInfo({...securityInfo, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <div className="mt-2">
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={isSaving || !securityInfo.oldPassword || !securityInfo.newPassword || !securityInfo.confirmPassword}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Updating...
                          </>
                        ) : "Update Password"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Two-Factor Authentication */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch 
                      checked={profile.twoFactorEnabled}
                      onCheckedChange={handleTwoFactorToggle}
                    />
                  </div>
                  
                  {profile.twoFactorEnabled && (
                    <div className="bg-muted/50 p-4 rounded-md mt-4">
                      <p className="text-sm">
                        Two-factor authentication is enabled. A verification code will be sent to your
                        email or phone when you sign in from an unrecognized device.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Activity Log */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {activityLog.map(log => (
                      <div key={log.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{log.action}</span>
                          <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.browser} • IP: {log.ip}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        {/* Business Tab */}
        <TabsContent value="business">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Business Information */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Business Information</h2>
                    <Button 
                      onClick={handleSaveProfile}
                      variant="default"
                      size="sm"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dealership License Number</label>
                      <Input 
                        value={profile.dealerLicense}
                        onChange={(e) => setProfile({...profile, dealerLicense: e.target.value})}
                        placeholder="Enter license number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Select 
                        value={profile.state}
                        onValueChange={(value) => setProfile({...profile, state: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dealer Type</label>
                      <Select 
                        value={profile.dealerType}
                        onValueChange={(value) => setProfile({...profile, dealerType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select dealer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="independent">Independent</SelectItem>
                          <SelectItem value="franchise">Franchise</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tax ID (Optional)</label>
                      <Input 
                        value={profile.taxId}
                        onChange={(e) => setProfile({...profile, taxId: e.target.value})}
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Document Upload */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Business Documentation</h2>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center gap-4">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      
                      {documentFile ? (
                        <div className="flex flex-col items-center">
                          <p className="font-medium text-base">
                            {documentFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(documentFile.size / 1024).toFixed(0)} KB
                          </p>
                          
                          {isDocumentUploading ? (
                            <div className="mt-4 flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Uploading...</span>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => setDocumentFile(null)}
                            >
                              Remove File
                            </Button>
                          )}
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="mb-1 text-base font-medium">
                              Upload W-9 or Business Certificate
                            </p>
                            <p className="mb-4 text-sm text-muted-foreground">
                              Drag and drop your file here or click to browse
                            </p>
                          </div>
                          
                          <label htmlFor="dropzone-file" className="cursor-pointer">
                            <Button>
                              Choose File
                            </Button>
                            <input 
                              id="dropzone-file" 
                              type="file" 
                              className="hidden"
                              onChange={handleDocumentUpload}
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: PDF, DOC, DOCX. Maximum file size: 10MB.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Inventory View Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when someone views your inventory
                        </p>
                      </div>
                      <Switch 
                        checked={profile.notifyInventoryViewed}
                        onCheckedChange={() => handleNotificationChange("notifyInventoryViewed")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Lead Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive text messages for new lead inquiries
                        </p>
                      </div>
                      <Switch 
                        checked={profile.notifySmsLeads}
                        onCheckedChange={() => handleNotificationChange("notifySmsLeads")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive browser push notifications for important updates
                        </p>
                      </div>
                      <Switch 
                        checked={profile.notifyPush}
                        onCheckedChange={() => handleNotificationChange("notifyPush")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealerProfileSettings;
