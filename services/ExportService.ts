import jsPDF from 'jspdf';
import { Project, ExportFormat, ExportOptions, ExportResult, Scenario, ScenarioType } from '../types';

/**
 * ExportService
 * 
 * Handles exporting scenario sprint results to various formats.
 * Implements clean separation of concerns with testable methods.
 */
export class ExportService {
  /**
   * Export a project to the specified format
   */
  static async export(
    project: Project,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      switch (options.format) {
        case ExportFormat.PDF:
          return await this.exportToPDF(project, options);
        case ExportFormat.JSON:
          return this.exportToJSON(project, options);
        case ExportFormat.MARKDOWN:
          return this.exportToMarkdown(project, options);
        default:
          return {
            success: false,
            error: `Unsupported export format: ${options.format}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      };
    }
  }

  /**
   * Export project to PDF
   */
  private static async exportToPDF(
    project: Project,
    options: ExportOptions
  ): Promise<ExportResult> {
    const doc = new jsPDF();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = margin;

    // Helper to add text with word wrap
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, 170);
      
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    const addSpacer = (height: number = 10) => {
      yPosition += height;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Title
    doc.setFillColor(30, 41, 59); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(project.name, margin, 25);
    
    if (options.includeMetadata) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Created: ${new Date(project.createdAt).toLocaleDateString()}`, margin, 35);
    }

    yPosition = 50;
    doc.setTextColor(0, 0, 0);

    // Topic/Question
    if (project.data.topic) {
      addText('Scenario Sprint Question', 16, true);
      addSpacer(5);
      addText(project.data.topic, 12);
      addSpacer();
    }

    // Scenarios
    if (project.data.scenarios?.length > 0) {
      addText('Future Scenarios', 16, true);
      addSpacer(5);

      project.data.scenarios.forEach((scenario: Scenario, index: number) => {
        // Scenario type badge
        const [r, g, b] = this.getScenarioColor(scenario.type);
        doc.setFillColor(r, g, b);
        doc.roundedRect(margin, yPosition - 5, 40, 7, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(scenario.type, margin + 2, yPosition);
        yPosition += lineHeight;
        doc.setTextColor(0, 0, 0);

        addText(scenario.title, 13, true);
        addSpacer(3);
        addText(scenario.description, 10);
        addSpacer(5);

        // Indicators
        if (scenario.indicators?.length > 0) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Key Indicators:', margin, yPosition);
          yPosition += lineHeight;
          doc.setFont('helvetica', 'normal');
          
          scenario.indicators.forEach((indicator: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text('• ' + indicator, margin + 5, yPosition);
            yPosition += lineHeight;
          });
        }

        addSpacer();
      });
    }

    // Customer Goal
    if (project.data.goal) {
      addText('Customer/Business Goal', 16, true);
      addSpacer(5);
      addText(project.data.goal, 12);
      addSpacer();
    }

    // Strategy
    if (project.data.strategy) {
      addText('Strategic Recommendations', 16, true);
      addSpacer(5);

      // Persona
      if (project.data.strategy.persona) {
        const persona = project.data.strategy.persona;
        addText(`Target Persona: ${persona.name} (${persona.role})`, 12, true);
        addSpacer(3);
        addText(persona.description, 10);
        addSpacer(5);

        if (persona.painPoints?.length > 0) {
          addText('Pain Points:', 11, true);
          addSpacer(2);
          persona.painPoints.forEach((point: string) => {
            addText('• ' + point, 10);
          });
          addSpacer(5);
        }

        if (persona.goals?.length > 0) {
          addText('Goals:', 11, true);
          addSpacer(2);
          persona.goals.forEach((goal: string) => {
            addText('• ' + goal, 10);
          });
          addSpacer();
        }
      }

      // Recommendations
      if (project.data.strategy.recommendations?.length > 0) {
        addText('Action Plan', 14, true);
        addSpacer(5);

        project.data.strategy.recommendations.forEach((rec) => {
          addText(`[${rec.timeframe} | ${rec.impact} Impact] ${rec.title}`, 11, true);
          addSpacer(2);
          addText(rec.description, 10);
          addSpacer();
        });
      }

      // Risk Mitigation
      if (project.data.strategy.riskMitigation) {
        addText('Risk Mitigation', 14, true);
        addSpacer(5);
        addText(project.data.strategy.riskMitigation, 10);
      }
    }

    // Watermark
    if (options.watermark) {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Created with LeanForesight', 105, 290, { align: 'center' });
      }
    }

    const pdfBlob = doc.output('blob');
    return {
      success: true,
      data: pdfBlob,
    };
  }

  /**
   * Export project to JSON
   */
  private static exportToJSON(
    project: Project,
    options: ExportOptions
  ): ExportResult {
    const data = options.includeMetadata
      ? project
      : { name: project.name, data: project.data };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    return {
      success: true,
      data: blob,
    };
  }

  /**
   * Export project to Markdown
   */
  private static exportToMarkdown(
    project: Project,
    options: ExportOptions
  ): ExportResult {
    let markdown = `# ${project.name}\n\n`;

    if (options.includeMetadata) {
      markdown += `**Created:** ${new Date(project.createdAt).toLocaleDateString()}\n`;
      markdown += `**Last Updated:** ${new Date(project.updatedAt).toLocaleDateString()}\n\n`;
    }

    markdown += `---\n\n`;

    // Topic
    if (project.data.topic) {
      markdown += `## Scenario Sprint Question\n\n`;
      markdown += `${project.data.topic}\n\n`;
    }

    // Scenarios
    if (project.data.scenarios?.length > 0) {
      markdown += `## Future Scenarios\n\n`;

      project.data.scenarios.forEach((scenario: Scenario) => {
        markdown += `### ${scenario.type}: ${scenario.title}\n\n`;
        markdown += `${scenario.description}\n\n`;

        if (scenario.indicators?.length > 0) {
          markdown += `**Key Indicators:**\n\n`;
          scenario.indicators.forEach((indicator: string) => {
            markdown += `- ${indicator}\n`;
          });
          markdown += `\n`;
        }
      });
    }

    // Goal
    if (project.data.goal) {
      markdown += `## Customer/Business Goal\n\n`;
      markdown += `${project.data.goal}\n\n`;
    }

    // Strategy
    if (project.data.strategy) {
      markdown += `## Strategic Recommendations\n\n`;

      if (project.data.strategy.persona) {
        const persona = project.data.strategy.persona;
        markdown += `### Target Persona\n\n`;
        markdown += `**${persona.name}** (${persona.role})\n\n`;
        markdown += `${persona.description}\n\n`;

        if (persona.painPoints?.length > 0) {
          markdown += `**Pain Points:**\n\n`;
          persona.painPoints.forEach((point: string) => {
            markdown += `- ${point}\n`;
          });
          markdown += `\n`;
        }

        if (persona.goals?.length > 0) {
          markdown += `**Goals:**\n\n`;
          persona.goals.forEach((goal: string) => {
            markdown += `- ${goal}\n`;
          });
          markdown += `\n`;
        }
      }

      if (project.data.strategy.recommendations?.length > 0) {
        markdown += `### Action Plan\n\n`;
        project.data.strategy.recommendations.forEach((rec) => {
          markdown += `#### ${rec.title}\n\n`;
          markdown += `**Timeframe:** ${rec.timeframe} | **Impact:** ${rec.impact}\n\n`;
          markdown += `${rec.description}\n\n`;
        });
      }

      if (project.data.strategy.riskMitigation) {
        markdown += `### Risk Mitigation\n\n`;
        markdown += `${project.data.strategy.riskMitigation}\n\n`;
      }
    }

    if (options.watermark) {
      markdown += `---\n\n*Created with LeanForesight*\n`;
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });

    return {
      success: true,
      data: blob,
    };
  }

  /**
   * Download blob as file
   */
  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get color for scenario type (RGB for jsPDF)
   */
  private static getScenarioColor(type: ScenarioType): [number, number, number] {
    switch (type) {
      case ScenarioType.BEST_CASE:
        return [74, 222, 128]; // green
      case ScenarioType.WORST_CASE:
        return [239, 68, 68]; // red
      case ScenarioType.PREFERRED:
        return [168, 85, 247]; // purple
      case ScenarioType.PLAUSIBLE:
        return [148, 163, 184]; // slate
      default:
        return [100, 116, 139]; // default slate
    }
  }
}