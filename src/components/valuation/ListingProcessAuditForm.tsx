import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  MapPin, 
  Car, 
  DollarSign, 
  Camera, 
  FileText,
  Settings,
  Target,
  RefreshCw
} from 'lucide-react';

interface ListingAuditResult {
  listingUrl?: string;
  captureDateTime?: string;
  source?: string;
  apiOutcome?: {
    status: 'success' | 'fail' | 'partial';
    httpCode?: number;
    errorMessage?: string;
    processingStages?: Array<{
      stage: string;
      passed: boolean;
    }>;
  };
  vin?: string;
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
  };
  stockNumber?: string;
  matchToSubject?: 'exact' | 'trim-level' | 'no-match';
  matchFailReason?: string;
  advertisedPrice?: number;
  dealerFeesListed?: boolean;
  feeTransparencyScore?: number;
  taxesIncluded?: boolean;
  odometer?: number;
  mileagePresent?: boolean;
  mileageFailReason?: string;
  dealerClaimedCondition?: string;
  photoCount?: number;
  hasVinPlatePhoto?: boolean;
  accidentDisclosure?: string;
  ownerCount?: number;
  titleStatus?: string;
  recallNotePresent?: boolean;
  inspectionStatus?: 'passed' | 'failed' | 'not-provided';
  keyFeatures?: string[];
  packages?: string[];
  specialPaint?: string;
  listingZip?: string;
  distanceFromTarget?: number;
  withinRadius?: boolean;
  radiusFailReason?: string;
  transferAvailable?: boolean;
  qualityScore?: number;
  systemConfidenceScore?: number;
  trustTier?: 'tier1' | 'tier2' | 'tier3';
  includedInCompSet?: boolean;
  exclusionReason?: string;
  fallbackMethod?: 'none' | 'depreciation-curve' | 'broadened-search' | 'manual-match';
  retryAttempts?: number;
  finalMethod?: string;
}

interface ListingProcessAuditFormProps {
  auditResult?: ListingAuditResult;
  onSave?: (auditData: Partial<ListingAuditResult>) => void;
  readonly?: boolean;
}

export const ListingProcessAuditForm: React.FC<ListingProcessAuditFormProps> = ({
  auditResult,
  onSave,
  readonly = false
}) => {
  const [formData, setFormData] = useState<Partial<ListingAuditResult>>(
    auditResult || {}
  );

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return status ? (
      <Badge variant="default" className="bg-green-100 text-green-800">{label}</Badge>
    ) : (
      <Badge variant="destructive">{label}</Badge>
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Capture & API Outcome */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            1) Capture & API Outcome
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="listingUrl">Listing URL</Label>
              <Input
                id="listingUrl"
                value={formData.listingUrl || ''}
                onChange={(e) => setFormData({...formData, listingUrl: e.target.value})}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="captureDateTime">Capture Date/Time</Label>
              <Input
                id="captureDateTime"
                type="datetime-local"
                value={formData.captureDateTime || ''}
                onChange={(e) => setFormData({...formData, captureDateTime: e.target.value})}
                readOnly={readonly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source (Dealer/Marketplace)</Label>
              <Input
                id="source"
                value={formData.source || ''}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="apiStatus">API Request Status</Label>
              <Select 
                value={formData.apiOutcome?.status || ''} 
                onValueChange={(value) => setFormData({
                  ...formData, 
                  apiOutcome: {...formData.apiOutcome!, status: value as any}
                })}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="httpCode">HTTP Status Code</Label>
              <Input
                id="httpCode"
                type="number"
                value={formData.apiOutcome?.httpCode || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  apiOutcome: {...formData.apiOutcome!, httpCode: parseInt(e.target.value)}
                })}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="errorMessage">API Error Message (if any)</Label>
              <Input
                id="errorMessage"
                value={formData.apiOutcome?.errorMessage || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  apiOutcome: {...formData.apiOutcome!, errorMessage: e.target.value}
                })}
                readOnly={readonly}
              />
            </div>
          </div>

          {/* Processing Pipeline Status */}
          <div>
            <Label className="text-sm font-medium">Processing Pipeline Status</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {formData.apiOutcome?.processingStages?.map((stage: any, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  {getStatusIcon(stage.passed)}
                  <span className="text-sm">{stage.stage.replace('_', ' ')}</span>
                  {getStatusBadge(stage.passed, stage.passed ? 'Pass' : 'Fail')}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Vehicle Identity Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            2) Vehicle Identity Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={formData.vin || ''}
                onChange={(e) => setFormData({...formData, vin: e.target.value})}
                readOnly={readonly}
                maxLength={17}
              />
            </div>
            <div>
              <Label htmlFor="stockNumber">Stock #</Label>
              <Input
                id="stockNumber"
                value={formData.stockNumber || ''}
                onChange={(e) => setFormData({...formData, stockNumber: e.target.value})}
                readOnly={readonly}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.vehicleInfo?.year || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicleInfo: {...formData.vehicleInfo!, year: parseInt(e.target.value)}
                })}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.vehicleInfo?.make || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicleInfo: {...formData.vehicleInfo!, make: e.target.value}
                })}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.vehicleInfo?.model || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicleInfo: {...formData.vehicleInfo!, model: e.target.value}
                })}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="trim">Trim</Label>
              <Input
                id="trim"
                value={formData.vehicleInfo?.trim || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicleInfo: {...formData.vehicleInfo!, trim: e.target.value}
                })}
                readOnly={readonly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="matchToSubject">Match to Subject VIN?</Label>
            <Select 
              value={formData.matchToSubject || ''} 
              onValueChange={(value) => setFormData({...formData, matchToSubject: value as any})}
              disabled={readonly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select match level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact</SelectItem>
                <SelectItem value="trim-level">Trim-level</SelectItem>
                <SelectItem value="no-match">No match</SelectItem>
              </SelectContent>
            </Select>
            {formData.matchFailReason && (
              <p className="text-sm text-red-600 mt-1">{formData.matchFailReason}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Price & Fee Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            3) Price & Fee Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="advertisedPrice">Advertised Price</Label>
              <Input
                id="advertisedPrice"
                type="number"
                value={formData.advertisedPrice || ''}
                onChange={(e) => setFormData({...formData, advertisedPrice: parseFloat(e.target.value)})}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="feeTransparency">Fee Transparency Score (/10)</Label>
              <Input
                id="feeTransparency"
                type="number"
                min="0"
                max="10"
                value={formData.feeTransparencyScore || ''}
                onChange={(e) => setFormData({...formData, feeTransparencyScore: parseFloat(e.target.value)})}
                readOnly={readonly}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dealerFeesListed"
                checked={formData.dealerFeesListed || false}
                onCheckedChange={(checked) => setFormData({...formData, dealerFeesListed: checked as boolean})}
                disabled={readonly}
              />
              <Label htmlFor="dealerFeesListed">Dealer fees listed?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="taxesIncluded"
                checked={formData.taxesIncluded || false}
                onCheckedChange={(checked) => setFormData({...formData, taxesIncluded: checked as boolean})}
                disabled={readonly}
              />
              <Label htmlFor="taxesIncluded">Taxes included?</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Mileage & Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            4) Mileage & Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="odometer">Odometer</Label>
              <Input
                id="odometer"
                type="number"
                value={formData.odometer || ''}
                onChange={(e) => setFormData({...formData, odometer: parseInt(e.target.value)})}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="photoCount">Photo Count</Label>
              <Input
                id="photoCount"
                type="number"
                value={formData.photoCount || ''}
                onChange={(e) => setFormData({...formData, photoCount: parseInt(e.target.value)})}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="dealerCondition">Dealer-Claimed Condition</Label>
              <Input
                id="dealerCondition"
                value={formData.dealerClaimedCondition || ''}
                onChange={(e) => setFormData({...formData, dealerClaimedCondition: e.target.value})}
                readOnly={readonly}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mileagePresent"
                checked={formData.mileagePresent || false}
                onCheckedChange={(checked) => setFormData({...formData, mileagePresent: checked as boolean})}
                disabled={readonly}
              />
              <Label htmlFor="mileagePresent">Mileage present?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vinPlatePhoto"
                checked={formData.hasVinPlatePhoto || false}
                onCheckedChange={(checked) => setFormData({...formData, hasVinPlatePhoto: checked as boolean})}
                disabled={readonly}
              />
              <Label htmlFor="vinPlatePhoto">VIN plate photo?</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 9: Listing Quality & Comp Inclusion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            9) Listing Quality & Comp Inclusion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="qualityScore">Listing Quality Score (/100)</Label>
              <Input
                id="qualityScore"
                type="number"
                min="0"
                max="100"
                value={formData.qualityScore || ''}
                onChange={(e) => setFormData({...formData, qualityScore: parseInt(e.target.value)})}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="confidenceScore">System Confidence Score (%)</Label>
              <Input
                id="confidenceScore"
                type="number"
                min="0"
                max="100"
                value={formData.systemConfidenceScore || ''}
                onChange={(e) => setFormData({...formData, systemConfidenceScore: parseInt(e.target.value)})}
                readOnly={readonly}
              />
            </div>
            <div>
              <Label htmlFor="trustTier">Trust Tier</Label>
              <Select 
                value={formData.trustTier || ''} 
                onValueChange={(value) => setFormData({...formData, trustTier: value as any})}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier1">Tier 1</SelectItem>
                  <SelectItem value="tier2">Tier 2</SelectItem>
                  <SelectItem value="tier3">Tier 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includedInCompSet"
              checked={formData.includedInCompSet || false}
              onCheckedChange={(checked) => setFormData({...formData, includedInCompSet: checked as boolean})}
              disabled={readonly}
            />
            <Label htmlFor="includedInCompSet">Was listing included in comp set?</Label>
          </div>

          {!formData.includedInCompSet && (
            <div>
              <Label htmlFor="exclusionReason">Exclusion Reason</Label>
              <Textarea
                id="exclusionReason"
                value={formData.exclusionReason || ''}
                onChange={(e) => setFormData({...formData, exclusionReason: e.target.value})}
                readOnly={readonly}
                placeholder="Reason why listing was excluded from comp set..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 10: Fallback & Retry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            10) Fallback & Retry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fallbackMethod">Fallback Method Used?</Label>
              <Select 
                value={formData.fallbackMethod || ''} 
                onValueChange={(value) => setFormData({...formData, fallbackMethod: value as any})}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="depreciation-curve">Depreciation Curve</SelectItem>
                  <SelectItem value="broadened-search">Broadened Search</SelectItem>
                  <SelectItem value="manual-match">Manual Match</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="retryAttempts">Retry Attempts</Label>
              <Input
                id="retryAttempts"
                type="number"
                min="0"
                value={formData.retryAttempts || ''}
                onChange={(e) => setFormData({...formData, retryAttempts: parseInt(e.target.value)})}
                readOnly={readonly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="finalMethod">Final Method for Valuation</Label>
            <Input
              id="finalMethod"
              value={formData.finalMethod || ''}
              onChange={(e) => setFormData({...formData, finalMethod: e.target.value})}
              readOnly={readonly}
              placeholder="e.g., market_listings, depreciation_model, hybrid_approach"
            />
          </div>
        </CardContent>
      </Card>

      {!readonly && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Audit Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListingProcessAuditForm;