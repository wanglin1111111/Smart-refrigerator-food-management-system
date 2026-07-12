import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const generateIcon = (size) => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#22c55e"/>
  <text x="${size/2}" y="${size/2}" font-size="${size * 0.4}" font-family="sans-serif" fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">鲜</text>
</svg>
`.trim();

  return svg;
};

const sizes = [192, 512];

sizes.forEach(size => {
  const svgContent = generateIcon(size);
  const filePath = path.join(publicDir, `icon-${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated ${filePath}`);
});

console.log('Icons generated successfully!');
