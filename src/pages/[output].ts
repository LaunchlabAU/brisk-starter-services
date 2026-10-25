import { build } from '../data';
// The outputs every site makes (@briskcms/kit/build.js).
export function getStaticPaths() {
  return Object.keys(build.outputs()).map((output) => ({
    params: { output },
  }));
}
export function GET({ params }: { params: { output?: string } }) {
  return new Response(build.outputs()[params.output!], {
    headers: {
      'Content-Type': params.output?.endsWith('.xml')
        ? 'application/xml'
        : 'text/plain',
    },
  });
}
