# ADR-001: AI/ML Stack Selection for Vehicle Valuation

## Status
Accepted

## Context

The AIN Valuation Engine requires a robust AI/ML stack to deliver accurate vehicle valuations. The system must handle multiple data sources, provide explainable predictions, and scale to enterprise levels. Key requirements include:

- Real-time valuation processing
- Explainability for financial and regulatory compliance
- Integration with multiple automotive data APIs
- Scalability for enterprise deployments
- Cost-effective operation

## Decision

We have selected a hybrid AI/ML stack combining multiple approaches:

### Primary Stack:
- **OpenAI GPT-3.5-turbo**: For narrative generation and complex reasoning
- **SHAP (SHapley Additive exPlanations)**: For model explainability
- **Scikit-learn**: For traditional ML models (Random Forest, Gradient Boosting)
- **PyTorch**: For neural network models when needed
- **MLflow**: For experiment tracking and model versioning

### Supporting Infrastructure:
- **Supabase**: For data storage with built-in RPC functions
- **React/TypeScript**: For frontend with real-time updates
- **Node.js/Express**: For API layer and service orchestration

## Consequences

### Positive:
- **Rapid Development**: Leveraging OpenAI reduces development time for NLP features
- **Enterprise Ready**: SHAP provides audit-friendly explanations
- **Flexibility**: Multiple model types support different use cases
- **Cost Control**: Mix of cloud and local processing optimizes costs
- **Proven Stack**: All components have enterprise adoption

### Negative:
- **External Dependency**: OpenAI API creates potential single point of failure
- **Complexity**: Multiple frameworks require diverse expertise
- **Cost Scaling**: OpenAI costs scale with usage
- **Data Privacy**: External API requires careful data handling

## Alternatives Considered

### 1. Pure Local ML Stack
- **Pros**: Complete control, no external dependencies, predictable costs
- **Cons**: Longer development time, requires significant ML expertise, limited NLP capabilities

### 2. Google Cloud AI Platform
- **Pros**: Integrated ecosystem, AutoML capabilities, enterprise support
- **Cons**: Vendor lock-in, higher costs, steeper learning curve

### 3. Azure Machine Learning
- **Pros**: Strong enterprise features, integrated with Azure ecosystem
- **Cons**: Complex pricing model, requires Azure commitment

## Implementation Notes

- OpenAI API key management through environment variables
- Fallback mechanisms for OpenAI service interruptions
- Model versioning strategy using MLflow
- Regular evaluation of OpenAI alternatives as local models improve
- Data sanitization before external API calls

## Review Date
2025-07-08 (6 months from acceptance)