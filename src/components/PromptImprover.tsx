import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Wand2, Key, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { improvePromptWithAI, improvePromptDemo } from "@/lib/prompt-improver";

const PromptImprover = () => {
  const [prompt, setPrompt] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [useDemo, setUseDemo] = useState(false);
  const { toast } = useToast();

  const improvePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "The prompt field cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      if (useDemo || !apiKey.trim()) {
        // Use demo improvement
        await new Promise((resolve) => setTimeout(resolve, 1500));
        result = {
          improvedPrompt: improvePromptDemo(prompt),
          success: true
        };
      } else {
        // Use AI improvement
        result = await improvePromptWithAI({
          originalPrompt: prompt,
          apiKey: apiKey.trim()
        });
      }

      if (result.success) {
        setImprovedPrompt(result.improvedPrompt);
        toast({
          title: "Prompt improved!",
          description: useDemo 
            ? "Your prompt has been enhanced with demo improvements." 
            : "Your prompt has been enhanced using AI analysis.",
        });
      } else {
        throw new Error(result.error || "Failed to improve prompt");
      }
    } catch (error) {
      toast({
        title: "Error improving prompt",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(improvedPrompt);
      toast({
        title: "Copied to clipboard!",
        description: "You can now paste the improved prompt anywhere",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
          AI Prompt Improver
        </h1>
        <p className="text-muted-foreground">
          Enter your prompt below and let AI help you make it better using advanced prompt engineering techniques
        </p>
      </div>

      <Alert className="border-brand-200 bg-brand-50/50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          For best results, enter your <strong>Perplexity API key</strong> below. Without an API key, we'll use demo improvements.
          <br />
          <span className="text-xs text-muted-foreground mt-1 block">
            Get your API key from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Perplexity AI Settings</a>
          </span>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Perplexity API Key (Optional)
          </label>
          <Input
            type="password"
            placeholder="pplx-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono text-sm"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useDemo"
              checked={useDemo}
              onChange={(e) => setUseDemo(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="useDemo" className="text-sm text-muted-foreground">
              Use demo mode (basic improvements without API)
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Prompt</label>
          <Textarea
            placeholder="Enter your prompt here... (e.g., 'Write a blog post about AI')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        <Button
          onClick={improvePrompt}
          className="w-full bg-brand-600 hover:bg-brand-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {useDemo || !apiKey.trim() ? "Applying demo improvements..." : "Analyzing with AI..."}
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              {useDemo || !apiKey.trim() ? "Improve Prompt (Demo)" : "Improve Prompt (AI)"}
            </>
          )}
        </Button>

        {improvedPrompt && (
          <div className="space-y-2 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Improved Version</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-100/50 to-brand-200/50 rounded-lg" />
              <Textarea
                value={improvedPrompt}
                readOnly
                className="min-h-[150px] resize-none bg-transparent relative z-10"
              />
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <strong>Improvements applied:</strong> Enhanced specificity, added context requirements, improved structure guidelines, and optimized for better AI comprehension.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptImprover;