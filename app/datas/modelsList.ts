import type ModelsList from "../types/modelsList"

const modelsList: ModelsList = [
  {
    id: "mistral_large_3",
    smallName: "Mistral Large 3",
    name: "Mistral Large 3",
    description:
      "One of the best OSS models in the world: open-weight, general-purpose, flagship multimodal and multilingual model.",
    explanation:
      "Mistral Large 3 is our largest model to date, featuring 41B active parameters and 675B total parameters, with a large 256k context window, and offers powerful agentic capabilities.",
    image: "mistral-large.svg",
  },
  {
    id: "ministral_family",
    smallName: "Ministral Family",
    name: "Ministral Family",
    description:
      "3B, 8B, and 14B brings best-in-class frontier AI to the edge.",
    explanation:
      "Combining compact efficiency with multimodal and multilingual capability. Engineered for edge devices, self-hosted systems, and robotics, these models seamlessly blend language, vision, and reasoning into highly efficient architectures",
    image: "ministral.svg",
  },
  {
    id: "magistral",
    smallName: "Magistral",
    name: "Magistral",
    description:
      "Specialized, transparent, and multilingual reasoning.",
    explanation:
      "Complex thinking, backed by deep understanding, with transparent reasoning you can follow and verify. The model excels in maintaining high-fidelity reasoning across numerous languages, even when switching between languages mid-task.",
    image: "nemo.svg",
  },
  {
    id: "medium_3",
    smallName: "Medium 3",
    name: "Medium 3",
    description:
      "State-of-the-art performance at 8X lower cost.",
    explanation:
      "Delivering a range of enterprise capabilities including hybrid or on-premises / in-VPC deployment, custom post-training, and integration into enterprise tools and systems.",
    image: "mistral-medium.svg",
  },
  {
    id: "mistral_small",
    smallName: "Mistral Small",
    name: "Mistral Small",
    description:
      "Enterprise-ready, compact powerhouse.",
    explanation:
      "The most powerful model in its size class, combining efficiency with remarkable capabilities. Ideal for production deployments requiring balance between performance and resource usage.",
    image: "voxel-small.svg",
  },
  {
    id: "document_ai",
    smallName: "Document AI",
    name: "Document AI",
    description:
      "Enterprise-grade document processing.",
    explanation:
      "Extract and understand complex text, handwriting, tables, and images from any document, with 99%+ accuracy across global languages.",
    image: "document-ai.svg",
  },
  {
    id: "codestral",
    smallName: "Codestral",
    name: "Codestral",
    description:
      "Elevating code generation.",
    explanation:
      "Purpose-built for code generation and understanding, optimized for developer workflows.",
    image: "codestral.svg",
  },
  {
    id: "voxtral",
    smallName: "Voxtral",
    name: "Voxtral",
    description:
      "Voxtral is a family of audio models with state-of-the-art speech to text capabilities.",
    explanation:
      "It delivers the right balance between frontier performance, affordable pricing, and flexible deployments.",
    image: "voxel.svg",
  },
  {
    id: "mistral_embed",
    smallName: "Mistral Embed",
    name: "Mistral Embed",
    description:
      "Enabling internal semantic search.",
    explanation:
      "State-of-the-art embedding model for semantic search and content organization.",
    image: "nemo.svg",
  },
  {
    id: "multimodal_models",
    smallName: "Multimodal Models",
    name: "Multimodal Models",
    description:
      "Vision pioneer, multimodal mastery.",
    explanation:
      "Combine text, image, and structured data understanding in a single model. Process diverse input types while maintaining consistent quality across modalities.",
    image: "mistral-large.svg",
  },
  {
    id: "mistral_moderation",
    smallName: "Mistral Moderation",
    name: "Mistral Moderation",
    description:
      "Intelligent content safety at scale.",
    explanation:
      "A fine-tuned model offering customizable content moderation across nine safety categories in multiple languages. Designed for both raw text and conversational content with high accuracy and pragmatic safety guardrails.",
    image: "nemo.svg",
  },
]

export default modelsList
