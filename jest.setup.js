// jest.setup.js

// Mock TurboModuleRegistry
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
    getEnforcing: jest.fn(),
    get: jest.fn(),
}));

// Mock NativeModules
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
    DevMenu: {},
    DevSettings: {
        addMenuItem: jest.fn(),
        reload: jest.fn(),
    },
    PlatformConstants: {
        isTesting: true,
        reactNativeVersion: { major: 0, minor: 70, patch: 0 },
    },
}));

// Mock expo-av
jest.mock('expo-av', () => ({
    Audio: {
        Sound: jest.fn(() => ({
            loadAsync: jest.fn(),
            playAsync: jest.fn(),
            unloadAsync: jest.fn(),
            setPositionAsync: jest.fn(),
            setVolumeAsync: jest.fn(),
        })),
        setAudioModeAsync: jest.fn(),
    },
}));

// Mock react-native Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    Version: 14,
    select: jest.fn((obj) => obj.ios),
    isTesting: true,
}));

// Mock Vibration
jest.mock('react-native/Libraries/Vibration/Vibration', () => ({
    vibrate: jest.fn(),
    cancel: jest.fn(),
}));

// Mock Animated
const mockAnimatedValue = {
    setValue: jest.fn(),
    interpolate: jest.fn(() => mockAnimatedValue),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    stopAnimation: jest.fn(),
    resetAnimation: jest.fn(),
    _value: 0,
};

/*jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
    __esModule: true,
    default: {
        API: {
            createAnimatedNode: jest.fn(),
            startListeningToAnimatedNodeValue: jest.fn(),
            stopListeningToAnimatedNodeValue: jest.fn(),
            connectAnimatedNodes: jest.fn(),
            disconnectAnimatedNodes: jest.fn(),
            startAnimatingNode: jest.fn(),
            stopAnimation: jest.fn(),
            setAnimatedNodeValue: jest.fn(),
            setAnimatedNodeOffset: jest.fn(),
            flattenAnimatedNodeOffset: jest.fn(),
            extractAnimatedNodeOffset: jest.fn(),
            connectAnimatedNodeToView: jest.fn(),
            disconnectAnimatedNodeFromView: jest.fn(),
            restoreDefaultValues: jest.fn(),
            dropAnimatedNode: jest.fn(),
            addAnimatedEventToView: jest.fn(),
            removeAnimatedEventFromView: jest.fn(),
        },
    },
}));*/

// Suppress console warnings in tests
global.console = {
    ...console,
    warn: jest.fn(),
    error: jest.fn(),
};