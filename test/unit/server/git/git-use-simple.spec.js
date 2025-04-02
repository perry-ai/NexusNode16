// 引入测试模块
import * as git from '../../server/api/git/git-use-simple';
import simpleGit from 'simple-git';
import NexusConfig from '../../../NexusNode16.config.js';

// 全局mock配置（可放在setupTests.js）
jest.mock('simple-git', () => {
  return jest.fn(() => ({
    add: jest.fn().mockReturnThis(),
    commit: jest.fn().mockReturnThis(),
    checkoutLocalBranch: jest.fn().mockReturnThis(),
    push: jest.fn().mockReturnThis(),
    checkout: jest.fn().mockReturnThis(),
    mergeFromTo: jest.fn().mockReturnThis(),
    pull: jest.fn().mockReturnThis(),
    revparse: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    log: jest.fn().mockReturnThis(),
    reset: jest.fn().mockReturnThis(),
  }));
});

// mock 配置
jest.mock('../../../NexusNode16.config.js', () => ({
  tempDir: '/mock/temp/dir', // 模拟临时目录路径
}));

describe('Git操作单元测试', () => {
  let mockGit;
  beforeEach(() => {
    mockGit = simpleGit.mock.instances[0] || simpleGit();
    jest.clearAllMocks(); // 每次重置mock
  });

  // 测试commitChanges
  test('commitChanges应调用add和commit', async () => {
    const repoPath = '/mock/repo';
    await git.commitChanges(repoPath, 'test commit');
    expect(simpleGit).toHaveBeenCalledWith(repoPath);
    expect(mockGit.add).toHaveBeenCalledWith(['.']);
    expect(mockGit.commit).toHaveBeenCalledWith('test commit');
  });

  // 测试createBranch
  test('createBranch应创建并推送本地分支', async () => {
    const repoPath = '/mock/repo';
    const branchName = 'test-branch';
    await git.createBranch(repoPath, branchName);
    expect(mockGit.checkoutLocalBranch).toHaveBeenCalledWith(branchName);
    expect(mockGit.push).toHaveBeenCalledWith('origin', branchName);
  });

  // 测试异常处理（以checkoutBranch为例）
  test('checkoutBranch应处理远程分支', async () => {
    const repoPath = '/mock/repo';
    const branchName = 'remote-branch';
    await git.checkoutBranch(repoPath, branchName, true);
    expect(mockGit.checkout).toHaveBeenCalledWith('remotes/origin/remote-branch');
  });

  // 更多测试用例（示例）
  test('pullUpdates应支持rebase选项', async () => {
    const repoPath = '/mock/repo';
    await git.pullUpdates(repoPath, 'main', true);
    expect(mockGit.pull).toHaveBeenCalledWith('origin', 'main', { '--rebase': 'true' });
  });

  // 测试compareCommitDiffs方法
  test('compareCommitDiffs应返回包含文件变更的提交历史', async () => {
    const repoPath = '/mock/repo';
    const mockLog = {
      all: [{
        hash: 'commit1',
        author_name: 'test',
        author_email: 'test@example.com',
        date: '2025-01-01',
        message: 'test commit',
        parents: ['parent1']
      }]
    };
    const mockShow = 'A\tfile1.txt\nM\tfile2.txt\n';
    
    mockGit.log.mockResolvedValue(mockLog);
    mockGit.show.mockResolvedValue(mockShow);

    const result = await git.compareCommitDiffs(repoPath, 'from', 'to');
    
    expect(result).toEqual([{
      id: 'commit1',
      author: 'test',
      email: 'test@example.com',
      date: new Date('2025-01-01'),
      message: 'test commit',
      parent: ['parent1'],
      files: [
        { file: 'file1.txt', status: '新增' },
        { file: 'file2.txt', status: '修改' }
      ]
    }]);
  });
});
