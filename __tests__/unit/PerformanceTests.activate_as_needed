import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualIDE } from "../../src/VirtualIDE";
import { advancedRustExampleActions } from "../fixtures/rustAdvancedExample";

// Helper to measure approximate object size in memory
function getObjectSizeInKB(object) {
    // Convert object to string representation
    const objectString = JSON.stringify(object);

    // Calculate size in bytes (2 bytes per character in UTF-16)
    // This is an approximation and doesn't account for JS engine optimizations
    const sizeInBytes = objectString.length * 2;

    // Return size in KB
    return sizeInBytes / 1024;
}

// Mock project data - just use an array of actions since it is the simplest project type
const mockProject: Array<IAction> = []

// Function to generate mock actions
function generateMockActions(count) {
    const actions: Array<IAction> = [];

    for (let i = 0; i < count; i++) {

        // select randomly from advancedRustExampleActions, 0 to length of advancedRustExampleActions
        const exampleAction = advancedRustExampleActions[i % advancedRustExampleActions.length];

        actions.push(exampleAction);
    }

    return actions;
}

// Test different action counts
describe('VirtualIDE Performance Tests', () => {
    const actionCounts = [1000, 5000, 10000];

    // Helper function to measure and log memory usage
    function measureMemoryUsage(virtualIDE: VirtualIDE, numActions: number) {
        // Get heap statistics before garbage collection
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;

        // Estimate size of various components
        // const actionsSize = getObjectSizeInKB(virtualIDE.getAppliedActions());
        // const snapshotsSize = getObjectSizeInKB(Array.from(virtualIDE.cachedSnapshots.values()));
        // const lastSnapshotSize = virtualIDE.lastComputedSnapshot ?
        //     getObjectSizeInKB(virtualIDE.lastComputedSnapshot) : 0;

        console.log(`\n--- Memory Usage with ${numActions} actions ---`);
        console.log(`Total Heap Used: ${heapUsedMB.toFixed(2)} MB`);
        // console.log(`Actions Size: ${actionsSize.toFixed(2)} KB`);
        // console.log(`Cached Snapshots Size: ${snapshotsSize.toFixed(2)} KB`);
        // console.log(`Last Snapshot Size: ${lastSnapshotSize.toFixed(2)} KB`);
        // console.log(`Total VirtualIDE Est. Size: ${(actionsSize + snapshotsSize + lastSnapshotSize).toFixed(2)} KB`);
        // console.log(`Number of Cached Snapshots: ${virtualIDE.cachedSnapshots.size}`);

        return {
            heapUsedMB,
            // actionsSize,
            // snapshotsSize,
            // lastSnapshotSize,
            // totalSize: actionsSize + snapshotsSize + lastSnapshotSize,
            // numSnapshots: virtualIDE.cachedSnapshots.size
        };
    }

    actionCounts.forEach(count => {
        test(`Performance with ${count} actions`, () => {
            const actions = generateMockActions(count);

            // Warm-up run (to avoid first-run bias)
            const warmupIDE = new VirtualIDE(mockProject);
            warmupIDE.applyActions(actions);
            warmupIDE.getCourseSnapshot();

            // Actual test
            const startTime = performance.now();

            const virtualIDE = new VirtualIDE(mockProject);
            virtualIDE.applyActions(actions);
            const courseSnapshot = virtualIDE.getCourseSnapshot();

            const endTime = performance.now();
            const duration = endTime - startTime;

            console.log(`${count} actions took ${duration.toFixed(2)}ms`);

            // Measure memory usage
            const memoryStats = measureMemoryUsage(virtualIDE, count);

            // Optional: Assert that performance and memory usage are within acceptable limits
            // For example: 
            // expect(duration).toBeLessThan(500); // 500ms threshold
            // expect(memoryStats.totalSize).toBeLessThan(10 * 1024); // 10MB threshold

            // Ensure the snapshot was created correctly
            expect(courseSnapshot).toBeDefined();
        });
    });

    // Test incremental updates
    test('Performance of incremental updates', () => {
        const initialActions = generateMockActions(100);
        const additionalActions = generateMockActions(10);

        // Initial setup
        const virtualIDE = new VirtualIDE(mockProject);

        // Time the initial application
        const initialStartTime = performance.now();
        virtualIDE.applyActions(initialActions);
        let snapshot = virtualIDE.getCourseSnapshot();
        const initialEndTime = performance.now();

        const initialDuration = initialEndTime - initialStartTime;
        console.log(`Initial 100 actions took ${initialDuration.toFixed(2)}ms`);

        // Measure memory usage after initial setup
        console.log("\n--- Memory Usage after initial setup ---");
        const initialMemory = measureMemoryUsage(virtualIDE, 100);

        // Time an incremental update
        const updateStartTime = performance.now();
        virtualIDE.applyActions(additionalActions);
        snapshot = virtualIDE.getCourseSnapshot();
        const updateEndTime = performance.now();

        const updateDuration = updateEndTime - updateStartTime;
        console.log(`Incremental 10 actions took ${updateDuration.toFixed(2)}ms`);

        // Measure memory usage after updates
        console.log("\n--- Memory Usage after incremental update ---");
        const updatedMemory = measureMemoryUsage(virtualIDE, 110);

        // Calculate memory growth
        // const memoryGrowth = updatedMemory.totalSize - initialMemory.totalSize;
        // console.log(`Memory growth from incremental update: ${memoryGrowth.toFixed(2)} KB`);

        // Expectations
        expect(snapshot).toBeDefined();
    });

    // Test memory usage with different snapshot intervals
    test('Memory usage with different snapshot intervals', () => {
        const actions = generateMockActions(500);
        const intervals = [10, 50, 100, 250];

        const memoryResults: Array<{
            interval: number;
            duration: number;
            heapUsedMB: number;
        }> = [];

        for (const interval of intervals) {
            // Create new instance with specific interval
            const virtualIDE = new VirtualIDE(mockProject);
            //   virtualIDE.setSnapshotInterval(interval);

            // Apply all actions and generate snapshots
            const startTime = performance.now();
            virtualIDE.applyActions(actions);
            //   virtualIDE.preGenerateSnapshots(interval);
            const snapshot = virtualIDE.getCourseSnapshot();
            const endTime = performance.now();

            // Measure memory usage
            console.log(`\n--- With snapshot interval: ${interval} ---`);
            const memStats = measureMemoryUsage(virtualIDE, 500);
            memoryResults.push({
                interval,
                duration: endTime - startTime,
                ...memStats
            });

            // Ensure the snapshot was created correctly
            expect(snapshot).toBeDefined();
        }

        // Log comparison table
        console.log("\n--- Memory Usage Comparison by Interval ---");
        console.log("Interval | Duration (ms) | # Snapshots | Total Size (KB)");
        console.log("---------|---------------|-------------|---------------");
        memoryResults.forEach(result => {
            console.log(`${result.interval.toString().padEnd(9)} | ${result.duration.toFixed(2).padEnd(13)} |  | `);
        });
    });
});