# 项目架构说明

## 📁 目录结构

```
src/
├── components/           # 无状态的简单组件
│   ├── ui/              # 基础UI组件
│   ├── FormField.tsx    # 表单字段组件
│   ├── CustomFieldItem.tsx # 自定义字段项组件
│   ├── BasicInfoSection.tsx
│   ├── TimelineSection.tsx
│   └── ResumeDisplay.tsx
├── containers/          # 有状态的容器组件
│   ├── BasicInfoEditorContainer.tsx
│   └── MainPageContainer.tsx
├── hooks/              # 业务逻辑Hooks
│   └── useBasicInfoEditor.ts
├── pages/              # 页面入口
│   ├── MainPage.tsx    # 只组合容器组件
│   └── PreviewPage.tsx
├── store/              # 状态管理
├── types/              # 类型定义
└── config/             # 配置文件
```

## 🏗️ 架构层次

### 1. Components Layer (无状态组件)
- **职责**: 纯展示组件，接收props渲染UI
- **特点**: 无业务逻辑，可复用性强
- **示例**: `FormField`, `CustomFieldItem`

### 2. Containers Layer (容器组件)
- **职责**: 组合无状态组件，接入业务逻辑
- **特点**: 使用Hooks管理状态，组织UI结构
- **示例**: `BasicInfoEditorContainer`, `MainPageContainer`

### 3. Hooks Layer (业务逻辑)
- **职责**: 封装可复用的业务逻辑
- **特点**: 独立于UI，便于测试和复用
- **示例**: `useBasicInfoEditor`

### 4. Pages Layer (页面入口)
- **职责**: 页面级别的路由组件
- **特点**: 只组合容器组件，保持简洁
- **示例**: `MainPage` -> `MainPageContainer`

## 🔄 数据流

```
Page -> Container -> Hook -> Store
  ↓       ↓         ↓
Component <- Props <- State
```

## 📊 重构成果

### 代码行数对比
| 文件 | 重构前 | 重构后 | 减少 |
|------|-------|-------|------|
| BasicInfoEditor | 308行 | - | 100% |
| BasicInfoEditorContainer | - | 95行 | 新增 |
| useBasicInfoEditor | - | 71行 | 新增 |
| FormField | - | 23行 | 新增 |
| CustomFieldItem | - | 82行 | 新增 |
| MainPage | 142行 | 3行 | 98% |

### 架构优势
- ✅ **关注点分离**: UI、状态、业务逻辑各司其职
- ✅ **可复用性**: 组件和Hook可在不同场景复用
- ✅ **可测试性**: 业务逻辑独立，便于单元测试
- ✅ **可维护性**: 代码结构清晰，修改影响范围小
- ✅ **类型安全**: 完整的TypeScript类型定义 