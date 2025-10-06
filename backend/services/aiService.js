// AI Service Module - Ready for future AI integration
// This module provides a clean interface for AI-powered features

class AIService {
  constructor() {
    this.isEnabled = false;
    this.apiKey = null;
    this.model = 'gpt-3.5-turbo'; // Default model
  }

  // Initialize AI service with API key
  initialize(apiKey, model = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
    this.isEnabled = true;
    console.log('AI Service initialized');
  }

  // Generate contextual suggestions for memory content
  async generateSuggestions(content, category) {
    if (!this.isEnabled) {
      return { suggestions: [], tags: [], context: '' };
    }

    try {
      // This would integrate with OpenAI API or similar
      const prompt = `Analyze this memory content and suggest:
      1. Relevant tags (comma-separated)
      2. Additional context
      3. Importance level (1-5)
      
      Content: "${content}"
      Category: "${category}"
      
      Respond in JSON format: {"tags": "tag1,tag2", "context": "suggested context", "importance": 3}`;

      // Placeholder for actual AI API call
      return {
        tags: this.generateBasicTags(content, category),
        context: this.generateBasicContext(content, category),
        importance: this.estimateImportance(content, category)
      };
    } catch (error) {
      console.error('AI suggestion generation failed:', error);
      return { suggestions: [], tags: [], context: '' };
    }
  }

  // Search memories with AI-powered semantic search
  async semanticSearch(query, memories) {
    if (!this.isEnabled) {
      return this.basicSearch(query, memories);
    }

    try {
      // This would use embeddings for semantic search
      // For now, return enhanced basic search
      return this.enhancedSearch(query, memories);
    } catch (error) {
      console.error('Semantic search failed:', error);
      return this.basicSearch(query, memories);
    }
  }

  // Generate memory insights and patterns
  async generateInsights(memories) {
    if (!this.isEnabled) {
      return this.basicInsights(memories);
    }

    try {
      // This would analyze memory patterns with AI
      return {
        patterns: this.identifyPatterns(memories),
        recommendations: this.generateRecommendations(memories),
        trends: this.analyzeTrends(memories)
      };
    } catch (error) {
      console.error('AI insights generation failed:', error);
      return this.basicInsights(memories);
    }
  }

  // Helper methods for basic functionality when AI is not available
  generateBasicTags(content, category) {
    const commonTags = {
      work: 'meeting,project,deadline',
      personal: 'family,friend,event',
      ideas: 'innovation,creative,planning',
      learning: 'study,skill,knowledge',
      contacts: 'person,relationship,network'
    };
    return commonTags[category] || 'important,note';
  }

  generateBasicContext(content, category) {
    const contexts = {
      work: 'Work-related information',
      personal: 'Personal note or reminder',
      ideas: 'Creative idea or concept',
      learning: 'Educational content or skill',
      contacts: 'Contact information or relationship note'
    };
    return contexts[category] || 'General information';
  }

  estimateImportance(content, category) {
    const importantKeywords = ['urgent', 'important', 'critical', 'deadline', 'meeting'];
    const hasImportantKeywords = importantKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    return hasImportantKeywords ? 4 : 2;
  }

  basicSearch(query, memories) {
    const queryLower = query.toLowerCase();
    return memories.filter(memory => 
      memory.content.toLowerCase().includes(queryLower) ||
      memory.tags.toLowerCase().includes(queryLower) ||
      memory.context.toLowerCase().includes(queryLower)
    );
  }

  enhancedSearch(query, memories) {
    // Enhanced search with better ranking
    const queryLower = query.toLowerCase();
    const scoredMemories = memories.map(memory => {
      let score = 0;
      
      // Content match (highest weight)
      if (memory.content.toLowerCase().includes(queryLower)) score += 3;
      
      // Tags match (medium weight)
      if (memory.tags.toLowerCase().includes(queryLower)) score += 2;
      
      // Context match (low weight)
      if (memory.context.toLowerCase().includes(queryLower)) score += 1;
      
      // Importance boost
      score += memory.importance * 0.1;
      
      return { ...memory, score };
    });
    
    return scoredMemories
      .filter(memory => memory.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...memory }) => memory);
  }

  basicInsights(memories) {
    const categories = {};
    const tags = {};
    let totalImportance = 0;
    
    memories.forEach(memory => {
      categories[memory.category] = (categories[memory.category] || 0) + 1;
      totalImportance += memory.importance;
      
      memory.tags.split(',').forEach(tag => {
        const cleanTag = tag.trim();
        if (cleanTag) {
          tags[cleanTag] = (tags[cleanTag] || 0) + 1;
        }
      });
    });
    
    return {
      totalMemories: memories.length,
      averageImportance: memories.length > 0 ? totalImportance / memories.length : 0,
      topCategories: Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 3),
      topTags: Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 5)
    };
  }

  identifyPatterns(memories) {
    // Basic pattern identification
    const patterns = [];
    
    // Time-based patterns
    const hourCounts = {};
    memories.forEach(memory => {
      const hour = new Date(memory.created_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    if (peakHour) {
      patterns.push(`Most active at ${peakHour[0]}:00`);
    }
    
    return patterns;
  }

  generateRecommendations(memories) {
    const recommendations = [];
    
    if (memories.length < 10) {
      recommendations.push('Add more memories to get better insights');
    }
    
    const lowImportanceCount = memories.filter(m => m.importance <= 2).length;
    if (lowImportanceCount > memories.length * 0.7) {
      recommendations.push('Consider rating more memories as important');
    }
    
    return recommendations;
  }

  analyzeTrends(memories) {
    // Basic trend analysis
    const trends = {
      growth: 'stable',
      categories: 'balanced',
      importance: 'moderate'
    };
    
    return trends;
  }
}

// Export singleton instance
const aiService = new AIService();

module.exports = aiService;
