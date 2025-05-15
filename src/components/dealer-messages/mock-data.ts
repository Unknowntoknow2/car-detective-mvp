
import { Lead, Message } from './types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    buyerName: 'John Smith',
    buyerInitials: 'JS',
    vehicleInfo: {
      year: 2021,
      make: 'Toyota',
      model: 'Camry',
      vin: '4T1BF1FK5MU123456',
      image: 'https://images.unsplash.com/photo-1621007971588-1c279f2d0f30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    lastMessage: {
      text: 'Is this vehicle still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
      sentByDealer: false
    },
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    contactInfo: {
      email: 'john.smith@example.com',
      phone: '(555) 123-4567'
    },
    offers: [],
    notes: 'Looking for family sedan, has a trade-in',
    tags: ['Hot Lead']
  },
  {
    id: '2',
    buyerName: 'Sarah Johnson',
    buyerInitials: 'SJ',
    buyerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    vehicleInfo: {
      year: 2020,
      make: 'Honda',
      model: 'Accord',
      vin: '1HGCV2F91LA012345',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    lastMessage: {
      text: 'Thank you for the information.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: true,
      sentByDealer: false
    },
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    contactInfo: {
      email: 'sarah.johnson@example.com',
      phone: '(555) 987-6543'
    },
    offers: [
      {
        id: 'o1',
        amount: 22500,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'countered',
        sentByDealer: true,
        counterAmount: 23500
      }
    ],
    notes: 'Interested in financing options',
    tags: ['Negotiating']
  },
  {
    id: '3',
    buyerName: 'Michael Williams',
    buyerInitials: 'MW',
    vehicleInfo: {
      year: 2022,
      make: 'Ford',
      model: 'F-150',
      vin: '1FTEW1EP5NFA54321',
      image: 'https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    lastMessage: {
      text: 'I can come by to see the truck tomorrow afternoon if that works for you.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: true,
      sentByDealer: false
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: true,
    contactInfo: {
      email: 'michael.williams@example.com',
      phone: '(555) 456-7890'
    },
    offers: [],
    notes: 'Looking for work truck, needs towing capability',
    tags: []
  },
  {
    id: '4',
    buyerName: 'Emily Davis',
    buyerInitials: 'ED',
    vehicleInfo: {
      year: 2023,
      make: 'Tesla',
      model: 'Model 3',
      vin: '5YJ3E1EA1PF123456',
      image: 'https://images.unsplash.com/photo-1619331502580-3bdb24168128?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    lastMessage: {
      text: 'Is home charging equipment included?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      sentByDealer: false
    },
    unreadCount: 3,
    isPinned: false,
    isArchived: false,
    contactInfo: {
      email: 'emily.davis@example.com',
      phone: '(555) 234-5678'
    },
    offers: [
      {
        id: 'o2',
        amount: 48900,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'pending',
        sentByDealer: true
      }
    ],
    notes: 'First-time EV buyer, had questions about charging',
    tags: ['Hot Lead', 'Financing']
  },
  {
    id: '5',
    buyerName: 'Robert Brown',
    buyerInitials: 'RB',
    vehicleInfo: {
      year: 2021,
      make: 'Chevrolet',
      model: 'Silverado',
      vin: '3GCUYDED5MG123456',
      image: 'https://images.unsplash.com/photo-1619873343944-8125931cc532?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    lastMessage: {
      text: 'Thanks for sending the additional photos. I\'ll let you know my decision soon.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isRead: true,
      sentByDealer: false
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    contactInfo: {
      email: 'robert.brown@example.com',
      phone: '(555) 345-6789'
    },
    offers: [],
    notes: 'Comparing with another dealer, needs to make decision by weekend',
    tags: ['Needs Follow Up']
  }
];

// Generate mock messages for each lead
export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '101',
      leadId: '1',
      text: 'Hello, I noticed your Toyota Camry listing and I\'m interested.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '102',
      leadId: '1',
      text: 'Hi John, thanks for your interest! Yes, the 2021 Camry is still available. Would you like to schedule a test drive?',
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '103',
      leadId: '1',
      text: 'Great! Does it have the advanced safety package?',
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '104',
      leadId: '1',
      text: 'Yes, it comes with Toyota Safety Sense 2.0 which includes pre-collision system, lane departure alert, and adaptive cruise control.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '105',
      leadId: '1',
      text: 'Perfect. What about the warranty?',
      timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '106',
      leadId: '1',
      text: 'It still has the remainder of Toyota\'s 3-year/36,000-mile basic warranty and 5-year/60,000-mile powertrain warranty. We also offer extended warranty options.',
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '107',
      leadId: '1',
      text: 'That sounds good. And what\'s your best price?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '108',
      leadId: '1',
      text: 'I can offer it at $24,500, which is below market value for this model with these features and mileage.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '109',
      leadId: '1',
      text: 'Do you accept trade-ins?',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '110',
      leadId: '1',
      text: 'Absolutely! We can appraise your trade-in when you come in. What vehicle would you be trading?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '111',
      leadId: '1',
      text: 'A 2017 Honda Civic with about 65,000 miles.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '112',
      leadId: '1',
      text: 'That\'s a great trade-in. Based on the information you provided, we could likely offer around $12,000-$13,000 depending on the condition, but we\'d need to see it in person for a final offer.',
      timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '113',
      leadId: '1',
      text: 'Is this vehicle still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      sentByDealer: false,
      isRead: false
    }
  ],
  '2': [
    {
      id: '201',
      leadId: '2',
      text: 'Hi, I\'m interested in the 2020 Honda Accord you have listed.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '202',
      leadId: '2',
      text: 'Hello Sarah! The Accord is one of our most popular models. It has only 18,000 miles and is in excellent condition. Would you like more details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '203',
      leadId: '2',
      text: 'Yes, please. What trim level is it?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '204',
      leadId: '2',
      text: 'It\'s the EX-L trim, which comes with leather seats, power moonroof, and the upgraded audio system.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21), // 21 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '205',
      leadId: '2',
      text: 'Great. I\'d like to make an offer.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '206',
      leadId: '2',
      text: 'We\'re asking $23,995. What did you have in mind?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19), // 19 hours ago
      sentByDealer: true,
      isRead: true,
      attachments: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        name: 'accord_interior.jpg'
      }]
    },
    {
      id: '207',
      leadId: '2',
      text: 'I can offer $22,500.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '208',
      leadId: '2',
      text: 'Thank you for the offer. Let me check with my manager.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 17), // 17 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '209',
      leadId: '2',
      text: 'I\'ve spoken with my manager, and we can accept your offer of $22,500.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '210',
      leadId: '2',
      text: 'Actually, I found another vehicle I\'m interested in. Could you go down to $21,500?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '211',
      leadId: '2',
      text: 'I understand you have other options. The best we can do is $22,500, which is already below market value for this model with these features and low mileage.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '212',
      leadId: '2',
      text: 'Thank you for the information.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      sentByDealer: false,
      isRead: true
    }
  ],
  '3': [
    {
      id: '301',
      leadId: '3',
      text: 'I saw your 2022 F-150 online and I\'m interested in taking a look.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '302',
      leadId: '3',
      text: 'Hi Michael, the F-150 is a great choice! It\'s the XLT trim with the 3.5L EcoBoost engine and has only 15,000 miles.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71), // 71 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '303',
      leadId: '3',
      text: 'What\'s the towing capacity?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70), // 70 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '304',
      leadId: '3',
      text: 'This configuration can tow up to 13,000 lbs. It also has the tow package installed, which includes integrated trailer brake controller and pro trailer backup assist.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 69), // 69 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '305',
      leadId: '3',
      text: 'That sounds perfect for my needs. I need to tow my boat which is about 7,500 lbs.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 68), // 68 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '306',
      leadId: '3',
      text: 'This F-150 will handle that with ease. Would you like to come see it in person?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 67), // 67 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '307',
      leadId: '3',
      text: 'I can come by to see the truck tomorrow afternoon if that works for you.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      sentByDealer: false,
      isRead: true
    }
  ],
  '4': [
    {
      id: '401',
      leadId: '4',
      text: 'Hello, I\'m considering the Tesla Model 3. Is it the long range version?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '402',
      leadId: '4',
      text: 'Hi Emily! Yes, this is the Long Range Dual Motor Model 3 with 358 miles of range. It\'s a 2023 model with only 3,500 miles.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5), // 5.5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '403',
      leadId: '4',
      text: 'What color is the interior?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '404',
      leadId: '4',
      text: 'It has the premium white interior, which is in immaculate condition. The exterior is Midnight Silver Metallic.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5), // 4.5 hours ago
      sentByDealer: true,
      isRead: true,
      attachments: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1619331502580-3bdb24168128?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        name: 'tesla_exterior.jpg'
      }]
    },
    {
      id: '405',
      leadId: '4',
      text: 'Perfect. I\'ve never owned an electric vehicle before. How does charging work?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '406',
      leadId: '4',
      text: 'Tesla makes charging very simple. You can charge at home using a standard outlet (slow), install a Tesla Wall Connector (faster), or use Tesla\'s Supercharger network for rapid charging on the go. The car comes with a mobile connector for home charging.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '407',
      leadId: '4',
      text: 'What\'s your best price for this Model 3?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '408',
      leadId: '4',
      text: 'We\'re asking $48,900, which is competitively priced for a 2023 Long Range with this low mileage. It also qualifies for the remaining manufacturer warranty.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '409',
      leadId: '4',
      text: 'I\'ll need to think about it. Do you offer financing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '410',
      leadId: '4',
      text: 'Yes, we offer competitive financing options through several lenders. With good credit, rates start as low as 3.99% APR. Would you like me to provide a quote based on your desired down payment?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '411',
      leadId: '4',
      text: 'That would be helpful. I\'m thinking about $10,000 down.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '412',
      leadId: '4',
      text: 'With $10,000 down on a 60-month loan at 3.99%, your monthly payment would be approximately $718. We can adjust the terms if needed.',
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '413',
      leadId: '4',
      text: 'Thanks for the information. One more thing - does the car have Enhanced Autopilot or Full Self-Driving?',
      timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '414',
      leadId: '4',
      text: 'This Model 3 has the basic Autopilot features (standard on all Teslas), which includes Traffic-Aware Cruise Control and Autosteer. It doesn\'t have Enhanced Autopilot or FSD, but those can be purchased directly from Tesla and added to the car at any time.',
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '415',
      leadId: '4',
      text: 'Is home charging equipment included?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sentByDealer: false,
      isRead: false
    }
  ],
  '5': [
    {
      id: '501',
      leadId: '5',
      text: 'Hi, I\'m looking at your Chevy Silverado. Can you tell me more about it?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '502',
      leadId: '5',
      text: 'Hello Robert! The 2021 Silverado is a 1500 LT with the Z71 Off-Road Package. It has the 5.3L V8 engine and is a crew cab with the standard bed. It has 22,000 miles and is in excellent condition.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11.5), // 11.5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '503',
      leadId: '5',
      text: 'What features does the Z71 package include?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11), // 11 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '504',
      leadId: '5',
      text: 'The Z71 package includes Rancho shocks, hill descent control, skid plates, an auto-locking rear differential, and all-terrain tires. This truck also has the trailering package with integrated brake controller.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10.5), // 10.5 hours ago
      sentByDealer: true,
      isRead: true
    },
    {
      id: '505',
      leadId: '5',
      text: 'Sounds good. Could you send me some more pictures of the interior and bed?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
      sentByDealer: false,
      isRead: true
    },
    {
      id: '506',
      leadId: '5',
      text: 'Absolutely! Here are some additional photos.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9), // 9 hours ago
      sentByDealer: true,
      isRead: true,
      attachments: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1613467143018-950e4c224468?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          name: 'silverado_interior.jpg'
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1605196788977-03352056be9c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          name: 'silverado_bed.jpg'
        }
      ]
    },
    {
      id: '507',
      leadId: '5',
      text: 'Thanks for sending the additional photos. I\'ll let you know my decision soon.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      sentByDealer: false,
      isRead: true
    }
  ]
};
