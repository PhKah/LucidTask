/**
 * Educational Program & Market Intelligence Schema
 * Reference: specs/Data_Schema_&_Seed_Data.md
 */

export interface MatchTraits {
  weight_logic: number;       // Trọng số Logic (0.0 - 1.0)
  weight_patience: number;    // Trọng số Kiên nhẫn (0.0 - 1.0)
  weight_resilience: number;  // Trọng số Chịu áp lực (0.0 - 1.0)
}

export interface AnonymousProfile {
  code_name: string;
  industry_cluster: string;
  focus_headline: string;
  core_curriculum_pillars: string[];
  practical_project_example: string;
  career_pathway: string;
  estimated_grad_salary_vnd: {
    min: number;
    max: number;
  };
}

export type InstitutionType =
  | 'PUBLIC_TOP'
  | 'PRIVATE_APPLIED'
  | 'VOCATIONAL_PRACTICAL'
  | 'INTERNATIONAL_JOINT';

export interface RevealedProfile {
  institution_name: string;
  institution_type: InstitutionType;
  campus_location: string;
  annual_tuition_vnd: number;
  training_duration_years: number;
  employment_rate_within_1yr: number;
  admissions_benchmark_note: string;
}

export interface EducationalProgram {
  id: string;
  match_traits: MatchTraits;
  anonymous_profile: AnonymousProfile;
  revealed_profile: RevealedProfile;
}

export interface IndustryMarketIntelligence {
  industry_id: string;
  industry_name: string;
  data_sources: string[];
  market_metrics: {
    salary_range_0_to_2_years_vnd: { min: number; max: number; median: number };
    salary_range_3_to_5_years_vnd: { min: number; max: number; median: number };
    long_term_growth_projection_2030: string;
    automation_ai_risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    automation_risk_explanation: string;
  };
  academic_risk_stats: {
    industry_dropout_or_shift_rate: number;
    root_cause_breakdown: {
      gap_between_expectation_and_reality: number;
      peer_or_parental_pressure: number;
      academic_struggle: number;
    };
    estimated_wasted_cost_1year_vnd: number;
    wasted_cost_breakdown: {
      tuition_lost: number;
      living_expenses_lost: number;
      opportunity_cost_youth_lost: number;
    };
  };
}
