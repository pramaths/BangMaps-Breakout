import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export interface LocationPoint {
  crimeCategory: string;
  latitude: number;
  longitude: number;
}

export interface WaterQualityData {
  BOD: number | null;
  conductivity: number | null;
  dissolved_oxygen: number | null;
  pH: number | null;
  temperature: number | null;
  total_coliform: number | null;
  total_dissolved_solids: number | null;
  total_hardness: number | null;
  turbidity: number | null;
  use_class: string | null;
}

export interface AnalysisData {
  crime: LocationPoint[];
  crime_risk: 'low' | 'medium' | 'high';
  flood: any[]; // Modify if flood data structure becomes available
  waterdepth: any[]; // Modify if waterdepth data structure becomes available
  waterdepth_risk: 'low' | 'medium' | 'high';
  waterquality: {
    data: WaterQualityData;
  }[];
}


const server = new McpServer({
  name: "MapAgent",
  version: "1.0.0",
});

server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

// Real estate form generation tool - simplified to 5-6 questions
server.tool(
  "generate_real_estate_form",
  {
    userQuery: z.string()
  },
  async ({ userQuery }) => ({
    content: [{
      type: "text",
      text: JSON.stringify({
        type: "form",
        formData: {
          id: `real-estate-${Date.now()}`,
          jsonSchema: {
            type: "object",
            required: ["propertyValue", "propertyType", "location", "purpose", "budget"],
            properties: {
              propertyType: {
                type: "string",
                title: "Property Type",
                description: "What type of property are you looking for?",
                enum: ["Apartment", "House", "Villa", "Land", "Commercial"]
              },
              location: {
                type: "string",
                title: "Preferred Location",
                description: "Where are you looking to buy/rent property?"
              },
              purpose: {
                type: "string",
                title: "Purpose",
                description: "What is your purpose for this property?",
                enum: ["Investment", "Primary Residence", "Vacation Home", "Rental Income", "Business"]
              },
              budget: {
                type: "number",
                title: "Budget",
                description: "What is your budget for this property?",
                minimum: 0
              },
              timeframe: {
                type: "string",
                title: "Timeframe",
                description: "When are you looking to purchase/rent?",
                enum: ["Immediately", "1-3 months", "3-6 months", "6-12 months", "1+ year"]
              }
            }
          },
          uiSchema: {
            propertyType: {
              "ui:placeholder": "Select property type",
              "ui:help": "The type of property you're interested in"
            },
            location: {
              "ui:placeholder": "Enter preferred location",
              "ui:help": "Specific area, neighborhood, or city"
            },
            purpose: {
              "ui:placeholder": "Select purpose",
              "ui:help": "Your primary reason for acquiring this property"
            },
            budget: {
              "ui:placeholder": "Enter your budget",
              "ui:help": "Your maximum budget for this property"
            },
            timeframe: {
              "ui:placeholder": "Select timeframe",
              "ui:help": "Your expected timeline for acquisition"
            }
          }
        }
      })
    }]
  })
);

server.tool(
  "generate_risk_analysis_with_visualization_charts",
  {
    userInput: z.string(),
    formData: z.record(z.any()).optional(),
    circle: z.object({
      center: z.object({
        lat: z.number(),
        lng: z.number()
      }),
      radius: z.number().optional()
    }).optional()
  },
  async ({circle }) => {
    try {
      // Format the circles data exactly as expected by the backend
      const circlesData = circle ? [{
        center: {
          lat: circle.center.lat,
          lng: circle.center.lng
        },
        radius: circle.radius || 1000
      }] : [];

      const response = await axios.post('http://127.0.0.1:5000/riskanalysis', {
        circles: circlesData
      });
      
      // Generate artifact for risk analysis visualization
      const artifactData = {
        type: "artifact",
        prompt: `Create a risk analysis dashboard with the following data: ${JSON.stringify(response.data.data || {})}. 
                Include charts for: 
                1. A risk score gauge showing overall safety level
                2. A bar chart comparing flood risk, crime risk, and water quality risk
                3. A pie chart showing the distribution of risk factors
                4. A color-coded risk map of the area
                Use a professional color scheme suitable for risk visualization.
                Make sure to generate the artifact with detials coming from api`
      };
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(artifactData)
        }]
      };
    } catch (error) {
      console.error("Error calling risk analysis API:", error);
      return {
        isError: true,
        content: [{
          type: "text",
          text: `Error performing risk analysis: ${error || "Unknown error"}`
        }]
      };
    }
  }
)

server.prompt("review-code", { code: z.string() }, ({ code }) => ({
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: `Please review this code:\n\n${code}`,
      },
    },
  ],
}));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});