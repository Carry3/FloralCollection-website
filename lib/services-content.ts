/**
 * Service screen content for the 12-panel residential section.
 * Service screen content for The Floral Collection.
 */
export interface ServiceScreenItem {
    id: string;
    title: string;
    description: string;
    image?: string;
}

export const SERVICE_SCREENS: ServiceScreenItem[] = [
    {
        id: "s1",
        title: "Smart Home Water, Moisture & Humidity Sensor Network Installation",
        description: "We install a distributed network of discreet environmental sensors throughout the property that continuously monitor for water presence, abnormal moisture accumulation, and humidity fluctuations 24/7. Sensors are strategically placed in high-risk areas including bathrooms, kitchens, laundry rooms, HVAC zones.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s2",
        title: "HVAC Condensate Drain Flow Sensors & Overflow Protection",
        description: "Three to four specialized sensors installed on the HVAC condensate drainage system monitor condensate flow and detect developing drain line blockages. Monitors primary flow, reduced drainage, and secondary overflow lines.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s3",
        title: "Intelligent Whole-Home Water Shutoff & Plumbing Leak Detection System",
        description: "A smart automatic shutoff valve on the main water supply line continuously monitors flow patterns and can shut off water immediately if abnormal activity is detected. Additional sensors at high-risk plumbing locations provide coordinated protection.",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&h=1080&fit=crop&q=80",
    },
    {
        id: "s4",
        title: "Proactive Monthly Interior & Exterior Property Inspections",
        description: "Each property is physically inspected every month to monitor structural condition, mechanical systems, and developing maintenance risks. Detailed photographic documentation and meter readings.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s5",
        title: "Asset Lifecycle Forecasting & Capital Planning",
        description: "Major building systems tracked and evaluated to estimate remaining useful life and anticipate replacement timelines. Helps owners prepare for capital expenditures.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s6",
        title: "Insurance-Grade Documentation & Risk Recordkeeping",
        description: "Inspection reports, condition photographs, sensor data, and maintenance records are continuously organized and archived. Supports insurance claims, audits, and disputes.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s7",
        title: "Integrated Financial Reporting & Property Performance Transparency",
        description: "Owners receive structured monthly financial reports outlining income, expenses, and operational activity. Clear insight into financial performance.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s8",
        title: "AI-Optimized Property Marketing & Pricing Strategy",
        description: "Data-driven pricing analysis and AI-assisted marketing strategies determine optimal rental price. Professional listing distribution maximizes exposure while attracting qualified applicants.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s9",
        title: "Executive-Level Tenant Screening & Risk Assessment",
        description: "Every applicant undergoes comprehensive screening including background checks, credit analysis, income verification, and rental history review.",
        image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s10",
        title: "Environmental Baseline Monitoring & Property Condition Analytics",
        description: "Sensor systems establish a unique environmental baseline for each property. Deviations signal developing leaks or mechanical issues before visible damage.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s11",
        title: "Controlled Eviction Coordination (At Cost for Uncontested Cases)",
        description: "When eviction becomes unavoidable, the process is coordinated carefully and professionally. Uncontested cases at cost, escalation to legal counsel when necessary.",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=960&h=720&fit=crop&q=80",
    },
    {
        id: "s12",
        title: "Transparent Maintenance Management with Zero Markup",
        description: "The Floral Collection does not profit from repairs or maintenance. Strict zero-markup policy, trusted vendor network, transparent cost control.",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=960&h=720&fit=crop&q=80",
    },
];
