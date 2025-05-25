import { Code } from "lucide-react";
import { useEffect, useState } from "react";

const AuthUI = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const codeSnippets = [
    `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
    `function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      stack.push(s[i]);
    } else {
      const last = stack.pop();
      if (map[last] !== s[i]) return false;
    }
  }
  
  return stack.length === 0;
}`,
  ];
  // Rotate through code snippets
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-100 p-16 relative overflow-hidden">
      <div className="z-10 max-w-lg flex flex-col items-center">
        {/* Code editor mockup */}
        <div className="w-full  bg-base-200 rounded-lg border border-base-300 mb-8 overflow-hidden">
          {/* Editor header */}
          <div className="bg-base-300 px-4 py-2 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-error hover:bg-error/80 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-warning hover:bg-warning/80 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-success hover:bg-success/80 transition-colors"></div>
            </div>
            <div className="text-xs font-mono text-base-content/70">
              Solution.js
            </div>
          </div>

          {/* Code content */}
          <div className="p-4 font-mono text-xs sm:text-sm overflow-hidden relative h-72">
            <pre
              className={`whitespace-pre-wrap text-green-400/90 transition-all duration-1000 transform ${
                activeIndex % 2 === 0
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              {codeSnippets[activeIndex]}
            </pre>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Code className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Text content */}
        <h2 className="text-3xl font-bold text-base-content mb-4 text-center">
          {title}
        </h2>
        <p className="text-base-content/70 text-center">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthUI;
