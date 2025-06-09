
import { ReportOptions } from "./types";

export const defaultReportOptions: ReportOptions = {
  pageSize: "letter",
  margins: { top: 72, right: 72, bottom: 72, left: 72 },
  includePageNumbers: true,
  includePhotos: true,
  includeSimilarVehicles: false,
  companyInfo: {
    name: "Car Detective",
    logo: null,
    website: "www.cardetective.com",
    phone: "(800) 555-1234",
  },
};
