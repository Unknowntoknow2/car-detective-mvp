
import React, { useState } from 'react';
import { useLeads } from '../context/LeadsContext';
import { Phone, Mail, MessageSquare, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BadgeEnhanced } from '@/components/ui/badge-enhanced';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export const LeadProfile: React.FC = () => {
  const { selectedLeadId, leads, updateNotes, addTag, removeTag } = useLeads();
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!selectedLeadId) return null;
  
  const lead = leads.find(l => l.id === selectedLeadId);
  if (!lead) return null;

  const handleSaveNotes = () => {
    updateNotes(selectedLeadId, notes);
    setIsEditingNotes(false);
  };

  const handleEditNotes = () => {
    setNotes(lead.notes);
    setIsEditingNotes(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !lead.tags.includes(newTag.trim())) {
      addTag(selectedLeadId, newTag.trim());
      setNewTag('');
    }
  };

  const presetTags = ['Hot Lead', 'Negotiating', 'Needs Follow Up', 'VIP', 'Financing', 'Cash Buyer', 'Price Shopper'];
  const availablePresets = presetTags.filter(tag => !lead.tags.includes(tag));

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-medium text-lg">Buyer Information</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {lead.buyerAvatar ? (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={lead.buyerAvatar} 
                    alt={lead.buyerName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  {lead.buyerInitials}
                </div>
              )}
              <div>
                <h2 className="font-semibold text-xl">{lead.buyerName}</h2>
                <div className="text-sm text-gray-500">Interested since {new Date(lead.lastMessage.timestamp).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center text-sm">
                <Phone size={16} className="mr-2 text-gray-500" />
                <a href={`tel:${lead.contactInfo.phone}`} className="text-blue-600 hover:underline">
                  {lead.contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Mail size={16} className="mr-2 text-gray-500" />
                <a href={`mailto:${lead.contactInfo.email}`} className="text-blue-600 hover:underline">
                  {lead.contactInfo.email}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <MessageSquare size={16} className="mr-2 text-gray-500" />
                <a href={`sms:${lead.contactInfo.phone}`} className="text-blue-600 hover:underline">
                  Send SMS
                </a>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-3">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone size={14} className="mr-1" /> Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Mail size={14} className="mr-1" /> Email
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare size={14} className="mr-1" /> SMS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-medium text-lg">Vehicle of Interest</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lead.vehicleInfo.image && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={lead.vehicleInfo.image} 
                  alt={`${lead.vehicleInfo.year} ${lead.vehicleInfo.make} ${lead.vehicleInfo.model}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            
            <h4 className="font-medium text-lg">
              {lead.vehicleInfo.year} {lead.vehicleInfo.make} {lead.vehicleInfo.model}
            </h4>
            
            <div className="text-sm text-gray-500">
              <div>VIN: {lead.vehicleInfo.vin}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {lead.offers.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <h3 className="font-medium text-lg">Offer History</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lead.offers.map((offer) => (
                <div key={offer.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-medium ${offer.sentByDealer ? 'text-blue-600' : ''}`}>
                        {offer.sentByDealer ? 'Your offer' : 'Buyer offer'}: ${offer.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(offer.timestamp).toLocaleDateString()} at {new Date(offer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div>
                      <BadgeEnhanced 
                        variant={
                          offer.status === 'accepted' ? 'success' : 
                          offer.status === 'rejected' ? 'destructive' : 
                          offer.status === 'countered' ? 'warning' : 
                          'secondary'
                        }
                      >
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </BadgeEnhanced>
                    </div>
                  </div>
                  
                  {offer.status === 'countered' && offer.counterAmount && (
                    <div className="mt-2 text-sm">
                      <div className="font-medium">Counter offer: ${offer.counterAmount.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <h3 className="font-medium text-lg">Dealer Notes</h3>
          {!isEditingNotes && (
            <Button variant="ghost" size="sm" onClick={handleEditNotes}>Edit</Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditingNotes ? (
            <div className="space-y-3">
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
                placeholder="Add notes about this lead..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 whitespace-pre-wrap min-h-[50px]">
              {lead.notes || "No notes added yet."}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-medium text-lg">Tags</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <BadgeEnhanced 
                  key={tag}
                  variant="secondary"
                  removable
                  onRemove={() => removeTag(selectedLeadId, tag)}
                >
                  {tag}
                </BadgeEnhanced>
              ))}
              
              {lead.tags.length === 0 && (
                <div className="text-sm text-gray-500">No tags added yet.</div>
              )}
            </div>
            
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag..."
                className="flex-grow px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Button type="submit" size="sm" disabled={!newTag.trim()}>
                Add
              </Button>
            </form>
            
            {availablePresets.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-2">Suggested tags:</div>
                <div className="flex flex-wrap gap-1">
                  {availablePresets.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(selectedLeadId, tag)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
