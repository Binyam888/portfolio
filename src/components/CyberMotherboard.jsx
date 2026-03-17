import { Float, Box, Edges } from '@react-three/drei';

function CyberMotherboard() {
    return (
        <group position={[0, -1.05, 0]}>
            {/* Base Layer - Dark with Blue glowing edges */}
            <Box args={[3.5, 0.1, 3.5]} position={[0, -0.1, 0]}>
                <meshStandardMaterial color="#050510" metalness={0.9} roughness={0.1} />
                <Edges scale={1.0} threshold={15} color="#0088ff" />
            </Box>

            {/* Middle Layer - Orange glowing layer */}
            <Box args={[2.5, 0.1, 2.5]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#110500" metalness={0.8} roughness={0.2} />
                <Edges scale={1.0} threshold={15} color="#ff5500" />
            </Box>

            {/* Top CPU Chip - Where the character stands */}
            <Box args={[1.2, 0.05, 1.2]} position={[0, 0.075, 0]}>
                <meshStandardMaterial color="#001122" metalness={0.9} roughness={0.1} />
                <Edges scale={1.0} threshold={15} color="#00e5ff" />
            </Box>
        </group>
    );
}

export default CyberMotherboard;
