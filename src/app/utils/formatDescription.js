import React from 'react';

export function formatProductDescription(description, className = "mb-4 last:mb-0") {
  if (!description) return null;

  const length = description.length;
  
  if (length < 200) {
    return <p className={className}>{description}</p>;
  }

  const parts = [];
  let numParagraphs = 1;
  
  if (length > 400) {
    numParagraphs = 3;
  } else if (length >= 200) {
    numParagraphs = 2;
  }
  
  // simple sentence splitting
  const sentences = description.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
  
  if (!sentences || sentences.length < numParagraphs) {
    return <p className={className}>{description}</p>;
  }

  const sentencesPerPara = Math.ceil(sentences.length / numParagraphs);
  
  for (let i = 0; i < numParagraphs; i++) {
    const chunk = sentences.slice(i * sentencesPerPara, (i + 1) * sentencesPerPara).join('').trim();
    if (chunk) {
      parts.push(chunk);
    }
  }

  return (
    <>
      {parts.map((part, index) => (
        <p key={index} className={className}>{part}</p>
      ))}
    </>
  );
}
