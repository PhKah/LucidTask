import { TaskDefinition } from '../types/task';
import { EducationalProgram, IndustryMarketIntelligence } from '../types/program';

import sweStage1 from './software_engineering/stage1_task.json';
import sweStage2 from './software_engineering/stage2_task.json';
import swePrograms from './software_engineering/programs.json';
import sweIndustry from './software_engineering/industry.json';

export interface IndustryModule {
  id: string;
  name: string;
  headline: string;
  stage1Task: TaskDefinition;
  stage2Task: TaskDefinition;
  programs: EducationalProgram[];
  marketIntelligence: IndustryMarketIntelligence;
}

export const registry: Record<string, IndustryModule> = {
  IND_TECH_SW: {
    id: sweIndustry.industry_id,
    name: sweIndustry.industry_name,
    headline: sweIndustry.headline,
    stage1Task: sweStage1 as unknown as TaskDefinition,
    stage2Task: sweStage2 as unknown as TaskDefinition,
    programs: swePrograms as unknown as EducationalProgram[],
    marketIntelligence: sweIndustry as unknown as IndustryMarketIntelligence,
  },
};

export const IndustryRegistry = {
  getIndustry(id: string): IndustryModule | undefined {
    return registry[id];
  },

  getAllIndustries(): Array<{ id: string; name: string; headline: string }> {
    return Object.values(registry).map(ind => ({
      id: ind.id,
      name: ind.name,
      headline: ind.headline,
    }));
  },

  getStageTask(industryId: string, stage: 1 | 2): TaskDefinition | undefined {
    const ind = registry[industryId];
    if (!ind) return undefined;
    return stage === 1 ? ind.stage1Task : ind.stage2Task;
  },

  getPrograms(industryId: string): EducationalProgram[] {
    const ind = registry[industryId];
    return ind ? ind.programs : [];
  },

  getAllPrograms(): EducationalProgram[] {
    return (swePrograms as unknown as EducationalProgram[]);
  },

  getMarketIntelligence(industryId: string): IndustryMarketIntelligence | undefined {
    return registry[industryId]?.marketIntelligence;
  },
};

export default IndustryRegistry;
